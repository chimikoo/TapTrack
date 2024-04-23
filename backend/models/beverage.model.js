import { Schema, model } from 'mongoose';

const sizePriceSchema = new Schema({
  size: String,
  price: Number,
});

const beverageModelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    default: 'beverage'
  },
  type: {
    type: String,
    required: true,
    enum: ['wine', 'spirits', 'beer', 'soda'],
  },
  extras: {
    type: [String],
    default: [],
  },
  sizesPrices: [sizePriceSchema],
});

const BeverageModel = model('menuItem', beverageModelSchema);

export default BeverageModel;

// ** This is what a post man request would look like for example **
// {
//  "name": "Example Drink",
//  "description": "This is an example drink",
//  "category": "beverage",
//  "type": "Wine",
//  "extras": ["Extra 1", "Extra 2"],
//  "sizesPrices": [
//    {"size": "Small", "price": 5.99},
//    {"size": "Large", "price": 8.99}
//  ]
//}