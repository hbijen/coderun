
export const SampleCodes: { language: string, code: string, question: string }[] = [
    {
        language: "c",
        "question": "Write a program that prints 'Hello, World!' ",
        "code": `
#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}
`
    },
    {
        language: "java",
        "question": "Write a program that prints 'Hello, World!' ",
        "code": `
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`
    },
    {
        language: "javascript",
        "question": "Write a function in javascript that returns the sum of 2 numbers",
        "code": `
function addNumbers(num1, num2) {
    return num1 + num2;
}

console.log( addNumbers(2,3) )
`

    }
]
