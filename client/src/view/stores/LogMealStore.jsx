import { EventEmitter } from "events";

import dispatcher from "view/dispatcher"

class LogMealStore extends EventEmitter {
  constructor() {
    super();
    this.meals = [];
    this.input_fields = {
      meal_name: "",
    };
    this.component_len = 1;
  }
  
  handleActions(action) {
    switch(action.type) {
        
      case "GOT_MEALS":
        this.updateMeals(action.meals);
        break;
        
      case "CREATE_MEAL":
        this.createMeal(action.meal);
        break;
        
      case "DELETE_MEAL":
        this.deleteMeal(action.meal);
        break;
        
      case "CHANGE_INPUT":
        this.updateInputVals(action.key, action.val, action.subkey);
        break;
        
      case "CHANGE_COMPONENT_LEN":
        this.updateComponentLen(action.len);
        break;
    }
  }
  
  deleteMeal(meal) {
    if (meal) {
      this.meals = this.meals.filter((el) =>{
        return el._id !== meal._id;
      });
      this.emit("MEALS_UPDATED");
    }
  }
  
  updateMeals(meals) {
    this.meals = meals;
    this.emit("MEALS_UPDATED");
  }
  
  updateInputVals(key, val, subkey) {
    if (typeof subkey === 'undefined') {
      this.input_fields[key] = val;
    }
    else {
      this.input_fields[key][subkey] = val
    }
    this.emit("INPUT_CHANGED");
  }
  
  createMeal(meal) {
    this.meals.push(meal);
    this.emit("MEALS_UPDATED");
  }
  
  updateComponentLen(len) {
    if (len >= this.component_len) {
      this.input_fields["component"+(len - 1)] = {
        name:"",
        calories: "",
        protein: "",
        quantity: "",
      };
    } else {
      delete this.input_fields["component"+(this.component_len - 1)]
    }
    this.component_len = len;
    this.emit("COMPONENT_LEN_CHANGED");
  }
  
  getMeals() {
    return this.meals;
  }
  
  getComponentLen() {
    return this.component_len;
  }
  
  getInputVals() {
    return this.input_fields;
  }
}

const logMealStore = new LogMealStore;
// Bind logMealStore so "this" is correct 
dispatcher.register(logMealStore.handleActions.bind(logMealStore));
window.dispatcher = dispatcher;
export default logMealStore;