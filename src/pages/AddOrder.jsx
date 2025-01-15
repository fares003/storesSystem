import React from 'react'

const AddOrder = () => {
  return (
    <div>
      
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