const hobbies = ['Sports', 'Cooking'];
const copiedHobbies = [...hobbies, 'Basketball']; // Spread Operator

const person = {
    Name: 'John',
    Age: 20,
    greet() {
        console.log('Hi ' + this.Name + ' Age => ' + this.Age)
    } 
} 

const copiedPerson = {...person} 

const toArray = (...args) => { // Rest Operator
    return args;
}
 