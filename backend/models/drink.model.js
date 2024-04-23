import { Schema, model } from 'mongoose';

const sizePriceSchema = new Schema({
  size: String,
  price: Number,
});

const drinkModelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Wine', 'Spirits', 'Beer', 'Soda'],
  },
  extras: {
    type: [String],
    default: [],
  },
  sizesPrices: [sizePriceSchema],
});

const DrinkModel = model('menuItem', drinkModelSchema);

export default DrinkModel;

// ** This is what a post man request would look like for example **
// {
//  "name": "Example Drink",
//  "description": "This is an example drink",
//  "type": "Wine",
//  "extras": ["Extra 1", "Extra 2"],
//  "sizesPrices": [
//    {"size": "Small", "price": 5.99},
//    {"size": "Large", "price": 8.99}
//  ]
//}