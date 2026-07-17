---
company: "bytedance"
id: "bytedance-r1-q1"
order: 1
label: "ByteDance — Live Coding Round 1"
labelStyle: "background:#1a2535; color:#38bdf8;"
navLabel: "R1 — Theory Questions"
title: "Theory + Coding Interview"
---

::: insight Format
<p>Mix of Java/backend theory questions followed by a LeetCode coding question in the same round.</p>
:::

::: problem Theory Q1 — What is IoC and how does it work?
<p><span class="highlight">IoC (Inversion of Control)</span> just flips who's in charge of creating objects. Normally, your code creates whatever it needs itself (<code>new UserRepository()</code>). With IoC, you hand that job over to a framework (like Spring) — you just say "I need one of these," and the framework builds it and hands it to you. That's why it's called "inversion" — control of object creation is flipped from your code to the framework.</p>
    <p>In Spring specifically, the objects the framework manages are called <span class="highlight">beans</span>. The framework builds them and plugs them into whatever needs them — this handing-over part is called <span class="highlight">Dependency Injection (DI)</span>. It can hand things over through the constructor, through a setter method, or by just marking a field with <code>@Autowired</code> and letting Spring fill it in.</p>


```java
// Without IoC — your code builds the dependency itself
UserService service = new UserService(new UserRepository());

// With IoC — Spring builds it and hands it to you
@Service
public class UserService {
    @Autowired
    private UserRepository repo;
}
```


:::

::: problem Theory Q2 — What is static and what if many instances use it?
<p>Normally, every object (instance) you create gets its own separate copy of each variable. Marking a variable or method <span class="highlight">static</span> changes that — it now belongs to the <span class="highlight">class itself</span>, not to any one object, so there's exactly <em>one</em> shared copy that every instance can see and change.</p>
    <p>That sharing is exactly the danger: if many instances (running on different threads) read and update that one shared static variable at the same time, you can get a <span class="highlight">race condition</span> — two updates happening at once step on each other and one gets lost. The fix is to make the update safe for multiple threads, using <code>synchronized</code> (only one thread at a time), <code>AtomicInteger</code> (a number type built to update safely), or <code>volatile</code> (makes sure every thread sees the latest value), depending on what you're protecting.</p>


```java
public class Counter {
    static AtomicInteger count = new AtomicInteger(0);
    // thread-safe — every instance shares this one counter safely
}
```


:::

::: problem Theory Q3 — What is JVM and how does it work?
<p>The <span class="highlight">JVM (Java Virtual Machine)</span> is the program that actually runs your Java code. Java's famous "write once, run anywhere" promise works because of it: your code doesn't run directly on Windows or Mac or Linux — it runs on the JVM, and the JVM is what's different on each OS.</p>
    <p>The flow: you write a <code>.java</code> file → a compiler called <code>javac</code> turns it into <code>.class</code> files (bytecode — a kind of universal, not-quite-machine-code format) → the JVM then either reads that bytecode step by step (interpreting) or compiles the hot/frequently-used parts into real machine code for speed (this speed-up step is called JIT — Just-In-Time compilation).</p>
    <p>The main parts inside the JVM: the <span class="highlight">Class Loader</span> (loads your <code>.class</code> files into memory), the memory areas it manages (heap for objects, stack for method calls, plus a couple of smaller areas), the <span class="highlight">Execution Engine</span> (the interpreter + JIT compiler that actually runs the code), and the <span class="highlight">Garbage Collector</span> (automatically frees up memory for objects nobody's using anymore, so you don't have to manually manage memory like in C).</p>
:::

::: problem Theory Q4 — Kafka topics, consumption, and partitions
<p>Kafka is a system for passing messages between different parts of an app. A <span class="highlight">topic</span> is like a named channel or category of messages — you create one with <code>kafka-topics.sh --create --topic my-topic --partitions 3 --replication-factor 1</code>.</p>
    <p>To actually read messages, a <span class="highlight">consumer</span> subscribes to a topic and keeps polling (checking) for new messages. If you have several consumers working together as a <span class="highlight">consumer group</span> (a team splitting up the work), Kafka divides the topic's partitions between them — each partition only ever gets read by one consumer in that group at a time, so they don't duplicate work.</p>
    <p><span class="highlight">Why more partitions means faster reading:</span> a partition is the smallest unit of work Kafka can hand to one consumer, so it's also the limit on how much you can parallelize. More partitions means more consumers can each be reading a different one at the same time — but only up to one consumer per partition, so with 3 partitions you can only ever have 3 consumers actively working in parallel, no matter how many more you add.</p>
:::

