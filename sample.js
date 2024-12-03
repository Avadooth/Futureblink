function fibonacciRecursive(n) {
    
    if (n === 0) return 0; // Base case: 0th Fibonacci is 0
    if (n === 1) return 1; // Base case: 1st Fibonacci is 1
    return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

console.log(fibonacciRecursive(5)); // Output: 5 (5th Fibonacci number)
console.log(fibonacciRecursive(10)); // Output: 55 (10th Fibonacci number)
