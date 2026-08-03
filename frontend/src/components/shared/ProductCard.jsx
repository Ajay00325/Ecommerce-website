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
        <div className="border rounded-xl shadow-lg overflow-hidden bg-white hover:shadow-2xl transition-all duration-300">

            {/* IMAGE */}
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
                className="w-full h-[300px] bg-white flex items-center justify-center overflow-hidden"
            >
                <img
                    src={getProductImageUrl(image)}
                    alt={productName}
                    className="max-w-[90%] max-h-[90%] object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* DETAILS */}
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
                    className="text-xl font-semibold cursor-pointer mb-2 h-14"
                >
                    {truncateText(productName, 50)}
                </h2>

                <div className="h-20">
                    <p className="text-gray-600 text-sm">
                        {truncateText(description, 80)}
                    </p>
                </div>

                {!about && (
                    <div className="flex items-center justify-between mt-4">

                        <div>
                            {specialPrice ? (
                                <>
                                    <p className="text-gray-400 line-through text-sm">
                                        {formatPrice(price)}
                                    </p>

                                    <p className="text-3xl font-bold text-slate-800">
                                        {formatPrice(specialPrice)}
                                    </p>
                                </>
                            ) : (
                                <p className="text-3xl font-bold text-slate-800">
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
                            } text-white px-4 py-3 rounded-lg flex items-center justify-center w-40 transition-all duration-300`}
                        >
                            <FaShoppingCart className="mr-2" />
                            {isAvailable ? "Add to Cart" : "Stock Out"}
                        </button>

                    </div>
                )}
            </div>

            <ProductViewModal
                open={openProductViewModal}
                setOpen={setOpenProductViewModal}
                product={selectedViewProduct}
                isAvailable={isAvailable}
            />
        </div>
    );
};

export default ProductCard;