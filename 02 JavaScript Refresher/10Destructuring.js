const person = {
    Name: 'John',
    Age: 20,
    greet() {
        console.log('Hi ' + this.Name + ' Age => ' + this.Age)
    } 
} 

const printName = ({ Name }) => {
    console.log('Name ' + Name);
}

printName(person)

const { Name, Age } = person;
console.log(Name, Age)

const hobbies = ['Sports', 'Cooking'];
const [hobby1, hobby2] = hobbies
console.log(hobby1, hobby2);
