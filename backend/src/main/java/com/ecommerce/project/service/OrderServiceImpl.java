package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.*;
import com.ecommerce.project.payload.OrderDTO;
import com.ecommerce.project.payload.OrderItemDTO;
import com.ecommerce.project.payload.OrderResponse;
import com.ecommerce.project.repositories.*;
import com.ecommerce.project.util.AuthUtil;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    CartRepository cartRepository;

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    CartService cartService;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    AuthUtil authUtil;

    @Override
    @Transactional
    public OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage) {
        Cart cart = cartRepository.findCartByEmail(emailId);
        if (cart == null) {
            throw new ResourceNotFoundException("Cart", "email", emailId);
        }

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));

        List<CartItem> cartItems = new ArrayList<>(cart.getCartItems());
        if (cartItems.isEmpty()) {
            throw new APIException("Cart is empty");
        }

        Map<Long, List<CartItem>> cartItemsBySeller = new LinkedHashMap<>();
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (product == null || product.getUser() == null) {
                throw new APIException("Product seller information is missing");
            }
            cartItemsBySeller
                    .computeIfAbsent(product.getUser().getUserId(), sellerId -> new ArrayList<>())
                    .add(cartItem);
        }

        List<OrderDTO> createdOrders = new ArrayList<>();
        for (List<CartItem> sellerCartItems : cartItemsBySeller.values()) {
            Order savedOrder = createSellerOrder(
                    emailId,
                    address,
                    sellerCartItems,
                    paymentMethod,
                    pgName,
                    pgPaymentId,
                    pgStatus,
                    pgResponseMessage
            );
            createdOrders.add(mapOrderToDTO(savedOrder));
        }

        cartItems.forEach(item -> {
            int quantity = item.getQuantity();
            Product product = item.getProduct();

            // Reduce stock quantity
            product.setQuantity(product.getQuantity() - quantity);

            // Save product back to the database
            productRepository.save(product);

            // Remove items from cart
            cartService.deleteProductFromCart(cart.getCartId(), item.getProduct().getProductId());
        });

        return createdOrders.get(0);
    }

    @Override
    public OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Order> pageOrders = orderRepository.findAll(pageDetails);
        List<Order> orders = pageOrders.getContent();
        List<OrderDTO> orderDTOs = orders.stream()
                .map(order -> modelMapper.map(order, OrderDTO.class))
                .toList();
        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setContent(orderDTOs);
        orderResponse.setPageNumber(pageOrders.getNumber());
        orderResponse.setPageSize(pageOrders.getSize());
        orderResponse.setTotalElements(pageOrders.getTotalElements());
        orderResponse.setTotalPages(pageOrders.getTotalPages());
        orderResponse.setLastPage(pageOrders.isLast());
        return orderResponse;
    }

    @Override
    public OrderDTO updateOrder(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order","orderId",orderId));
        order.setOrderStatus(status);
        orderRepository.save(order);
        return modelMapper.map(order, OrderDTO.class);
    }

    @Override
    public OrderResponse getAllSellerOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        User seller = authUtil.loggedInUser();

        Page<Order> pageOrders = orderRepository.findOrdersBySellerId(seller.getUserId(), pageDetails);

        List<OrderDTO> orderDTOs = pageOrders.getContent().stream()
                .map(order -> mapOrderToSellerDTO(order, seller.getUserId()))
                .toList();
        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setContent(orderDTOs);
        orderResponse.setPageNumber(pageOrders.getNumber());
        orderResponse.setPageSize(pageOrders.getSize());
        orderResponse.setTotalElements(pageOrders.getTotalElements());
        orderResponse.setTotalPages(pageOrders.getTotalPages());
        orderResponse.setLastPage(pageOrders.isLast());
        return orderResponse;
    }

    private Order createSellerOrder(String emailId,
                                    Address address,
                                    List<CartItem> sellerCartItems,
                                    String paymentMethod,
                                    String pgName,
                                    String pgPaymentId,
                                    String pgStatus,
                                    String pgResponseMessage) {
        Order order = new Order();
        order.setEmail(emailId);
        order.setOrderDate(LocalDate.now());
        order.setTotalAmount(calculateCartItemTotal(sellerCartItems));
        order.setOrderStatus("Accepted");
        order.setAddress(address);

        Payment payment = new Payment(paymentMethod, pgPaymentId, pgStatus, pgResponseMessage, pgName);
        payment.setOrder(order);
        payment = paymentRepository.save(payment);
        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = sellerCartItems.stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setProduct(cartItem.getProduct());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setDiscount(cartItem.getDiscount());
                    orderItem.setOrderedProductPrice(getCartItemUnitPrice(cartItem));
                    orderItem.setOrder(savedOrder);
                    return orderItem;
                })
                .toList();

        orderItems = orderItemRepository.saveAll(orderItems);
        savedOrder.setOrderItems(orderItems);
        return savedOrder;
    }

    private double calculateCartItemTotal(List<CartItem> cartItems) {
        return cartItems.stream()
                .mapToDouble(cartItem -> getCartItemUnitPrice(cartItem) * cartItem.getQuantity())
                .sum();
    }

    private double getCartItemUnitPrice(CartItem cartItem) {
        return cartItem.getProductPrice();
    }

    private OrderDTO mapOrderToDTO(Order order) {
        OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
        orderDTO.setOrderItems(order.getOrderItems().stream()
                .map(item -> modelMapper.map(item, OrderItemDTO.class))
                .collect(Collectors.toList()));
        if (order.getAddress() != null) {
            orderDTO.setAddressId(order.getAddress().getAddressId());
        }
        return orderDTO;
    }

    private OrderDTO mapOrderToSellerDTO(Order order, Long sellerId) {
        List<OrderItem> sellerItems = order.getOrderItems().stream()
                .filter(orderItem -> {
                    Product product = orderItem.getProduct();
                    return product != null
                            && product.getUser() != null
                            && product.getUser().getUserId().equals(sellerId);
                })
                .toList();

        OrderDTO orderDTO = mapOrderToDTO(order);
        orderDTO.setOrderItems(sellerItems.stream()
                .map(item -> modelMapper.map(item, OrderItemDTO.class))
                .collect(Collectors.toList()));
        orderDTO.setTotalAmount(sellerItems.stream()
                .mapToDouble(item -> item.getOrderedProductPrice() * item.getQuantity())
                .sum());
        return orderDTO;
    }

}
