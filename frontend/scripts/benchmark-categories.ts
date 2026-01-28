import { blogPosts } from '../data/blogPosts';

const iterations = 1000000;

console.log(`Running benchmark with ${iterations} iterations...`);

const start = performance.now();

for (let i = 0; i < iterations; i++) {
  const categories = ['Tümü', ...Array.from(new Set(blogPosts.map(post => post.category)))];
}

const end = performance.now();
const totalTime = end - start;

console.log(`Total time: ${totalTime.toFixed(2)}ms`);
console.log(`Average time per operation: ${(totalTime / iterations).toFixed(6)}ms`);
