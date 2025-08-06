import { useRef, useState } from "react";
import axios from 'axios';
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const menu = {
  "Cold Coffee": [
    { name: "Hard Rock Coffee", price: 59 },
    { name: "Coffee On The Rock", price: 79 },
    { name: "Cold Coffee With Ice cream", price: 89 },
    { name: "Mud Coffee", price: 109 },
    { name: "Oreo Coffee", price: 119 },
    { name: "KitKat Coffee", price: 119 },
    { name: "Belgium Coffee", price: 129 },
  ],
  Juice: [
    { name: "Jaljeera", price: 39 },
    { name: "Ginger Lime", price: 39 },
    { name: "Fresh Lime", price: 49 },
    { name: "Morrocan Mint", price: 49 },
    { name: "Orange", price: 59 },
    { name: "Apple", price: 59 },
    { name: "Pine Apple", price: 49 },
    { name: "Blue Lime", price: 69 },
  ],
  Mocktails: [
    { name: "Banana", price: 59 },
    { name: "Banana Bonkers", price: 79 },
    { name: "Strawberry", price: 79 },
    { name: "Musk Million", price: 79 },
    { name: "Belgium Chocolate", price: 79 },
    { name: "Mango", price: 79 },
    { name: "Pineapple", price: 79 },
    { name: "Apple", price: 79 },
    { name: "Chocolate", price: 59 },
  ],
  Shake: [
    { name: "Banana Shake", price: 59 },
    { name: "Strawberry Shake", price: 59 },
    { name: "Apple Shake", price: 59 },
    { name: "Mango Shake", price: 59 },
    { name: "Chocolate Shake", price: 69 },
    { name: "Oreo Shake", price: 79 },
    { name: "Kitkat Shake", price: 79 },
    { name: "Coconut Crush Shake", price: 79 },
    { name: "Vanilla Shake", price: 69 },
    { name: "Dry Fruit Shake", price: 119 },
  ],
  Snacks: [
    { name: "Upma", price: 59 },
    { name: "Chole Bhature", price: 79 },
    { name: "Vada Pav", price: 49 },
    { name: "Misal Pav", price: 59 },
    { name: "Pav Bhaji", price: 79 },
    { name: "Chana Rost", price: 109 },
    { name: "Chrispy Corn", price: 119 },
    { name: "Veg Cutlet", price: 79 },
    { name: "Paneer Cutlet", price: 119 },
    { name: "French Fries", price: 79 },
    { name: "French Fries Periperi", price: 89 },
    { name: "Cheese French Fries", price: 99 },
  ],
  "Sweet Chilli": [
    { name: "Veg Kothe", price: 99 },
    { name: "Paneer Kothe", price: 149 },
    { name: "Chilli Patato", price: 89 },
    { name: "Honey Chilli Patato", price: 129 },
    { name: "Chilli Paneer Dry", price: 149 },
    { name: "Chilli Paneer Gravy", price: 139 },
  ],
  Sandwich: [
    { name: "Plain Sandwich", price: 39 },
    { name: "Butter Sandwich", price: 49 },
    { name: "Veg Sandwich", price: 59 },
    { name: "Cheese Sandwich", price: 69 },
    { name: "Schezwan Sandwich", price: 69 },
    { name: "Corn Sandwich", price: 79 },
    { name: "Paneer Sandwich", price: 79 },
    { name: "Cheese Paneer Sandwich", price: 99 },
    { name: "Cheese Corn Sandwich", price: 99 },
  ],
  "South Indian": [
    { name: "Idli Sambar", price: 49 },
    { name: "Idli Fry", price: 69 },
    { name: "Plain Dosa", price: 59 },
    { name: "Masala Dosa", price: 79 },
    { name: "Cheese Dosa", price: 99 },
    { name: "Paneer Dosa", price: 129 },
    { name: "Cheese Paneer Dosa", price: 149 },
  ],
  Burger: [
    { name: "Aloo Tikki Burger", price: 39 },
    { name: "Veg Burger", price: 49 },
    { name: "Cheese Burger", price: 59 },
    { name: "Veg Schezwan Burger", price: 69 },
    { name: "Paneer Burger", price: 99 },
  ],
  Pizza: [
    { name: "Veg Pizza", price: 149 },
    { name: "Cheese Pizza", price: 159 },
    { name: "Paneer Tikka Pizza", price: 219 },
    { name: "Special Pizza", price: 259 },
  ],
  Pasta: [
    { name: "Red Sauce Pasta", price: 99 },
    { name: "White Sauce Pasta", price: 109 },
    { name: "Veg Schezwan Pasta", price: 109 },
    { name: "Special Pasta", price: 149 },
  ],
  Dal: [
    { name: "Dal Fry", price: 99 },
    { name: "Jeera Dal", price: 89 },
    { name: "Dal Tadka", price: 109 },
    { name: "Butter Dal", price: 119 },
  ],
  Raita: [
    { name: "Plain Raita", price: 25 },
    { name: "Veg Raita", price: 35 },
    { name: "Boondi Raita", price: 45 },
  ],
  Sweet: [
    { name: "Rasgulla", price: 20 },
    { name: "Gulab Jamun", price: 20 },
    { name: "Rasgulla With Rabdi", price: 50 },
  ],
  Thali: [
    { name: "Normal Thali (Dal, Sabji, 4 Roti, Rice,Salad, Papad, Achar)", price: 70 },
    { name: "Special Thali (Mix Veg, Paneer Sabji, Dal, 4 Roti, Jeera Rice, Salad, Raita, Papad, Achar)", price: 110 },
    { name: "Deluxe Thali (Sev Tamatar, Paneer Sabji, Dal Tadka, Veg Pulao, Sweet, 4 Roti, Salad, Raita, Papad, Achar) ", price: 150 },
  ],
};


function Home() {

  const [selected, setSelected] = useState([]);
  const [orderStep, setOrderStep] = useState(false);
  const [orderType, setOrderType] = useState("");
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const navigate = useNavigate();
  const targetRef = useRef(null);
  const bottomRef = useRef(null);

  const handleScroll = () => {
    setOrderStep(true);
    setTimeout(() => {
      targetRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCheckbox = (item) => {
    const exists = selected.find((i) => i.name === item.name);
    if (exists) {
      setSelected(selected.filter((i) => i.name !== item.name));
    } else {
      setSelected([...selected, item]);
    }
  };

  const totalAmount = selected.reduce((sum, item) => sum + item.price, 0);

  const handleOrderType = (e) => {
    setOrderType(e.target.value);
    setFormData({ name: "", phone: "", address: "" });

    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/order", {
        orderType,
        formData,
        items: selected,
        totalAmount
      });
      alert("Order submitted successfully!");
      window.location.reload();
    } catch (error) {
      alert("Failed to submit order.");
      console.error(error);
    }
  };


  return (
    <>
      <div className="flex flex-col min-h-screen p-4" style={{ backgroundColor: '#FEF1DA' }}>
        <div className="relative mb-6">
          <img
            src={logo}
            alt="Restaurant Logo"
            className="w-40 h-18 object-contain mx-auto"
          />
          <button
            onClick={() => navigate("/admin")}
            className="absolute right-0 top-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-medium"
          >
            Admin
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Menu Section */}
          <div className="lg:w-2/3 overflow-y-auto max-h-[80vh] pr-2">
            {Object.entries(menu).map(([category, items]) => (
              <div key={category} className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-indigo-800 border-b pb-1">{category}</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-center gap-3 bg-[#FEE8C0] p-3 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                      onClick={() => handleCheckbox(item)}
                    >
                      <input
                        type="checkbox"
                        checked={selected.some((i) => i.name === item.name)}
                        onChange={() => handleCheckbox(item)}
                        onClick={(e) => e.stopPropagation()} // Prevent checkbox click from toggling twice
                        className="accent-indigo-600"
                      />
                      <span className="text-gray-800">{item.name} - ₹{item.price}</span>
                    </li>

                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* Order Summary Section */}
            <div ref={targetRef} className={`w-full lg:w-1/3 lg:border-l lg:pl-6 flex flex-col justify-between overflow-y-auto max-h-full bg-white rounded-xl p-4 shadow
            ${selected.length > 0 && !orderStep ? 'hidden sm:flex' : 'flex'}`}>
            {!orderStep ? (
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-green-700">Selected Items</h2>
                  {selected.length === 0 ? (
                    <p className="text-gray-600">No items selected.</p>
                  ) : (
                    <ul className="space-y-2">
                      {selected.map((item) => (
                        <li key={item.name} className="text-gray-800">
                          ✅ {item.name} - ₹{item.price}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <div className="text-lg font-bold text-right mb-3 text-gray-800">
                    Total Amount: ₹{totalAmount}
                  </div>
                  {selected.length > 0 && (
                    <button
                      className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded w-full font-medium"
                      onClick={() => setOrderStep(true)}
                    >
                      Proceed to Order
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <h2 className="text-2xl font-semibold mb-4 text-blue-700">Select Order Type</h2>
                <div className="mb-4 space-y-3">
                  {["online", "takeaway", "inrestaurant"].map((type) => (
                    <label key={type} className="flex items-center gap-2 text-gray-800">
                      <input
                        type="radio"
                        name="orderType"
                        value={type}
                        checked={orderType === type}
                        onChange={handleOrderType}
                        className="accent-blue-600"
                      />
                      {type === "inrestaurant" ? "In Restaurant" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  ))}
                </div>

                {orderType && (
                  <div className="space-y-3 mt-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleInput}
                      className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                      required
                    />
                    {(orderType === "online" || orderType === "takeaway") && (
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInput}
                        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                        required
                      />
                    )}
                    {orderType === "online" && (
                      <textarea
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleInput}
                        className="border p-2 rounded w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                        required
                      ></textarea>
                    )}
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded w-full font-medium"
                      onClick={handleConfirmOrder}
                    >
                      Confirm Order
                    </button>
                        <div ref={bottomRef} className="h-1" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Order Summary Card for Mobile */}
      {selected.length > 0 && !orderStep && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md p-4 flex justify-between items-center sm:hidden z-50">
          <div>
            <p className="text-base font-semibold text-gray-800">Items: {selected.length}</p>
            <p className="text-sm text-gray-600">Total: ₹{totalAmount}</p>
          </div>
          <button
            onClick={handleScroll}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
          >
            Place Order
          </button>
        </div>
      )}



        
    </>
  );
}

export default Home