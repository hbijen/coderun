export type SampleTemplate = {
    question: string,
    code: string,
    version: string,
}
export const SampleCodes: {[key: string]: SampleTemplate} = {
    "empty": {
        "version": "",
        "question": "",
        "code": ""
    },
    "c": {
        "version": "10.2.0",
        "question": "Write a program that prints 'Hello, World!' ",
        "code": `
#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}
`
    },
    "java": {
        "version": "15.0.2",
        "question": "Write a program that prints 'Hello, World!' ",
        "code": `
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`
    },
    "javascript": {
        "version": "20.11.1",
        "question": "Write a function in javascript that returns the sum of 2 numbers",
        "code": `
function addNumbers(num1, num2) {
    return num1 + num2;
}

console.log( addNumbers(2,3) )
`

    }
}
