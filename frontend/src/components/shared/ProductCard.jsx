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
    const btnLoader = false;

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
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border">

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
                    className="w-full h-[260px] bg-white flex items-center justify-center overflow-hidden cursor-pointer"
                >
                    <img
                        src={getProductImageUrl(image)}
                        alt={productName}
                        loading="lazy"
                        className="
                            max-w-[85%]
                            max-h-[85%]
                            object-contain
                            transition-all
                            duration-300
                            hover:scale-105
                        "
                    />
                </div>

                {/* Product Details */}
                <div className="p-4">

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
                        className="text-2xl font-semibold cursor-pointer min-h-[60px]"
                    >
                        {truncateText(productName, 40)}
                    </h2>

                    <div className="h-[70px] mt-2">
                        <p className="text-gray-600 text-base">
                            {truncateText(description, 80)}
                        </p>
                    </div>

                    {!about && (
                        <div className="flex justify-between items-end mt-4">

                            <div>
                                {specialPrice ? (
                                    <>
                                        <p className="text-gray-400 line-through text-lg">
                                            {formatPrice(price)}
                                        </p>

                                        <p className="text-4xl font-bold text-slate-800">
                                            {formatPrice(specialPrice)}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-4xl font-bold text-slate-800">
                                        {formatPrice(price)}
                                    </p>
                                )}
                            </div>

                            <button
                                disabled={!isAvailable || btnLoader}
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
                                        : "bg-gray-400"
                                } text-white px-5 py-3 rounded-lg flex items-center justify-center transition-all duration-300`}
                            >
                                <FaShoppingCart className="mr-2" />
                                {isAvailable ? "Add to Cart" : "Stock Out"}
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