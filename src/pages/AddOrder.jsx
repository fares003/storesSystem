import AddNewOrder from '@/components/AddNewOrder'
import React from 'react'

const AddOrder = () => {
  return (
    <div>
      <AddNewOrder/>
    </div>
  )
}

export default AddOrder

// function CartItem({ item }) {
//   return (
//       <div className='item' key={item.sku}>
//           <div className='sku'>
//               {item.sku}
//           </div>
//           <div className='itemName'>
//               {item.name}
//           </div>
//           <div className='itemPrice'>
//               {item.price}
//           </div>
//           <div className='itemQuantity'>
//               {item.quantity}
//           </div>
//           <div className='itemTotal'>
//               {item.quantity * item.price}
//           </div>
//       </div>
//   )
// }

// function Cart({ items }) {
//   return items.map((item) => <CartItem key={item.sku} item={item} />);
// }

// export default function AddOrder({ order, deleteOrder }) {
//   return (
//       <div className='order' key={order.id}>
//           <input type='radio' name='openCart' id={order.id} className='dropdown cart' />
//           <label className='orderLabel' htmlFor={order.id}>
//               <div className='id'>{order.id}</div>
//               <div className='customer'>
//                   {order.customer.username}
//               </div>
//               <div className='orderTime'>
//                   {order.orderTime}
//               </div>
//               <div className='total'>
//                   {order.total}
//               </div>
//               <div className='cart'>
//                   <Cart items={order.cart} />
//               </div>
//           </label>
//           <img onClick={() => deleteOrder(order.id)} src='https://as1.ftcdn.net/jpg/03/07/87/26/1000_F_307872690_NwEPXiA4hsSM65lI2fropJfMnZZpj9Dw.jpg' className='deleteIcon' />
//       </div>
//   );
// }







































// import Center from "@/components/Center";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import { z } from "zod";

// const itemSchema = z.object({
//     name: z
//       .string()
//       .min(1, "Name is required"),
//     price: z
//       .union([z.number().positive(), z.string().refine((val) => !isNaN(parseFloat(val)), "Price is required and must be a valid number")])
//       .transform((val) => parseFloat(val)),
//     cost: z
//       .union([z.number().positive(), z.string().refine((val) => !isNaN(parseFloat(val)), "Cost is required and must be a valid number")])
//       .transform((val) => parseFloat(val)),
//     stock: z
//       .union([z.number().int().nonnegative(), z.string().refine((val) => !isNaN(parseInt(val)), "Stock is required and must be a valid integer")])
//       .transform((val) => parseInt(val)),
//     sku: z
//       .string()
//       .min(1, "SKU is required"),
//     description: z.string().optional(),
//   });

// function AddNewItem() {
//   const API = import.meta.env.VITE_API;
//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     cost: "",
//     stock: "",
//     sku: "",
//     description: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const addItem = async (e) => {
//     e.preventDefault();

//     try {
//       const parsedData = itemSchema.parse({
//         name: formData.name,
//         price: parseFloat(formData.price),
//         cost: parseFloat(formData.cost),
//         stock: parseInt(formData.stock),
//         sku: formData.sku,
//         description: formData.description,
//       });

//       const target = API + "item/create";
//       const request = {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(parsedData),
//       };

//       const response = await fetch(target, request);
//       if (response.ok) {
//         const data = await response.json();
//         console.log(data);
//         toast.success("Item added successfully", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         setFormData({
//           name: "",
//           price: "",
//           cost: "",
//           stock: "",
//           sku: "",
//           description: "",
//         });
//       } else {
//         toast.error("Error adding item", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       }
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         toast.error(error.errors[0].message, {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       } else {
//         console.error("Error adding item:", error);
//       }
//     }
//   };

//   return (
//     <Center>
//       <div className="flex flex-col gap-4 items-center w-full ">
//         <h2 className="textGradient text-5xl md:text-6xl font-semibold text-white">Add Item</h2>
//         <form
//           onSubmit={addItem}
//           className="grid grid-cols-10 w-[90%] md:w-[50%]  gap-4 items-center border shadow-lg shadow-slate-500 border-white rounded-2xl mx-6 md:mx-0 px-4 md:px-8 py-6"
//         >
//           <div className="col-span-5 flex flex-col gap-2">
//             <label className="text-white text-lg">Name</label>
//             <input
//               name="name"
//               className="p-2 rounded-md bg-transparent border text-white"
//               value={formData.name}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="col-span-5 flex flex-col gap-2">
//             <label className="text-white text-lg">Price</label>
//             <input
//               name="price"
//               type="number"
//               className="p-2 rounded-md bg-transparent border text-white"
//               value={formData.price}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="col-span-5 flex flex-col gap-2">
//             <label className="text-white text-lg">Cost</label>
//             <input
//               name="cost"
//               type="number"
//               className="p-2 rounded-md bg-transparent border text-white"
//               value={formData.cost}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="col-span-5 flex flex-col gap-2">
//             <label className="text-white text-lg">Stock</label>
//             <input
//               name="stock"
//               type="number"
//               className="p-2 rounded-md bg-transparent border text-white"
//               value={formData.stock}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="col-span-10 flex flex-col gap-2">
//             <label className="text-white text-lg">SKU</label>
//             <input
//               name="sku"
//               className="p-2 rounded-md bg-transparent border text-white"
//               value={formData.sku}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="col-span-10 flex flex-col gap-2">
//             <label className="text-white text-lg">Description</label>
//             <textarea
//               name="description"
//               className="p-2 rounded-md bg-transparent border text-white"
//               value={formData.description}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="col-span-10 flex items-center justify-center">
//             <button
//               type="submit"
//               className="text-white px-6 py-2 rounded-lg bg-[#4C5365] hover:bg-[#5A6172] gradient-btn duration-300"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </Center>
//   );
// }

// export default AddNewItem;
