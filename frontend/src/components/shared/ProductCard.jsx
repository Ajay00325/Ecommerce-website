import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ProductViewModal from "./ProductViewModal";
import truncateText from "../../utils/truncateText";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/actions";
import toast from "react-hot-toast";
import { formatPrice } from "../../utils/formatPrice";
import { getProductImageUrl } from "../../utils/imageUrl";

const ProductCard = ({
    productId,
    productName,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice,
    about = false,
}) => {

    const [openProductViewModal, setOpenProductViewModal] = useState(false);
    const [selectedViewProduct, setSelectedViewProduct] = useState("");

    const dispatch = useDispatch();

    const isAvailable = quantity && Number(quantity) > 0;

    const handleProductView = (product) => {
        if (!about) {
            setSelectedViewProduct(product);
            setOpenProductViewModal(true);
        }
    };

    const addToCartHandler = (cartItems) => {
        dispatch(addToCart(cartItems, 1, toast));
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border">

                {/* Product Image */}
                <div
                    onClick={() =>
                        handleProductView({
                            id: productId,
                            productName,
                            image,
                            description,
                            quantity,
                            price,
                            discount,
                            specialPrice,
                        })
                    }
                    className="h-60 bg-white flex items-center justify-center cursor-pointer p-4"
                >
                    <img
                        src={getProductImageUrl(image)}
                        alt={productName}
                        loading="lazy"
                        className="h-44 object-contain hover:scale-105 transition duration-300"
                    />
                </div>

                {/* Product Details */}
                <div className="p-5">

                    <h2
                        onClick={() =>
                            handleProductView({
                                id: productId,
                                productName,
                                image,
                                description,
                                quantity,
                                price,
                                discount,
                                specialPrice,
                            })
                        }
                        className="text-xl font-semibold text-gray-900 cursor-pointer leading-7 min-h-[56px]"
                    >
                        {truncateText(productName, 35)}
                    </h2>

                    <div className="mt-3 min-h-[60px]">
                        <p className="text-gray-500 text-sm leading-6">
                            {truncateText(description, 75)}
                        </p>
                    </div>

                    {!about && (
                        <div className="flex justify-between items-end mt-5 gap-3">

                            {/* Price */}
                            <div className="flex-1">

                                {specialPrice ? (
                                    <>
                                        <p className="text-gray-400 line-through text-sm">
                                            {formatPrice(price)}
                                        </p>

                                        <h3 className="text-2xl font-bold text-slate-900">
                                            {formatPrice(specialPrice)}
                                        </h3>
                                    </>
                                ) : (
                                    <h3 className="text-2xl font-bold text-slate-900">
                                        {formatPrice(price)}
                                    </h3>
                                )}

                            </div>

                            {/* Add To Cart Button */}
                            <button
                                disabled={!isAvailable}
                                onClick={() =>
                                    addToCartHandler({
                                        image,
                                        productName,
                                        description,
                                        specialPrice,
                                        price,
                                        productId,
                                        quantity,
                                    })
                                }
                                className={`${
                                    isAvailable
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                } text-white rounded-lg px-5 py-3 flex items-center gap-2 transition duration-300`}
                            >
                                <FaShoppingCart />

                                <span className="font-medium whitespace-nowrap">
                                    {isAvailable ? "Add to Cart" : "Out of Stock"}
                                </span>
                            </button>

                        </div>
                    )}
                </div>
            </div>

            <ProductViewModal
                open={openProductViewModal}
                setOpen={setOpenProductViewModal}
                product={selectedViewProduct}
                isAvailable={isAvailable}
            />
        </>
    );
};

export default ProductCard;