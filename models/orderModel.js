import mongoose from 'mongoose';

import OrderSchema from "../schemas/orders.js";
import {Collections} from "../core/constants.js";

const Orders = mongoose.model(Collections.ORDERS, OrderSchema)

export default Orders
