import mongoose from "mongoose";

import ItemSchema from "../schemas/items.js";
import {Collections} from "../core/constants.js";

const Items = mongoose.model(Collections.ITEMS, ItemSchema);

export default Items;