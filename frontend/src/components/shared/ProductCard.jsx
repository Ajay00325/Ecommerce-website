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
            <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 border overflow-hidden">

                {/* Image */}
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
                    className="h-60 flex items-center justify-center bg-gray-50 cursor-pointer"
                >
                    <img
                        src={getProductImageUrl(image)}
                        alt={productName}
                        loading="lazy"
                        className="h-44 object-contain hover:scale-105 transition duration-300"
                    />
                </div>

                {/* Details */}
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
                        className="text-xl font-semibold text-gray-800 cursor-pointer leading-7 h-14"
                    >
                        {truncateText(productName, 40)}
                    </h2>

                    <p className="text-sm text-gray-500 mt-3 h-14">
                        {truncateText(description, 75)}
                    </p>

                    {specialPrice ? (
                        <>
                            <p className="text-gray-400 line-through text-sm mt-4">
                                {formatPrice(price)}
                            </p>

                            <p className="text-3xl font-bold text-slate-900">
                                {formatPrice(specialPrice)}
                            </p>
                        </>
                    ) : (
                        <p className="text-3xl font-bold text-slate-900 mt-4">
                            {formatPrice(price)}
                        </p>
                    )}

                    {!about && (
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
                            className={`w-full mt-5 py-3 rounded-xl text-white font-medium flex justify-center items-center gap-2 transition ${
                                isAvailable
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-gray-400 cursor-not-allowed"
                            }`}
                        >
                            <FaShoppingCart />
                            {isAvailable ? "Add to Cart" : "Out of Stock"}
                        </button>
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