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