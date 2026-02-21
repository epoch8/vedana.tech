---
title: "Tools for Vedana"
---

## Why Tools Exist

Vedana does not let the LLM "guess" answers.

Instead, the LLM operates through explicit tools.

Tools allow Vedana to:

- Inspect the graph
    
- Retrieve relevant data
    
- Combine structure and semantics
    
- Produce grounded answers
    

The LLM behaves like an agent that selects and uses tools to explore the database.

---

# Built-in Tools

Vedana ships with two core tools out of the box.

## 1. Vector Search Tool

Purpose: semantic retrieval over text.

Used for:

- Searching document chunks
    
- Finding relevant FAQ entries
    
- Semantic similarity matching
    

How it works:

- Embeddings are stored in Memgraph
    
- Query is embedded
    
- Nearest neighbors are retrieved
    

Vector search is useful when:

- The query is text-heavy
    
- Exact structure is unknown
    
- Semantic matching is required
    

Limitations:

- Does not understand structure
    
- Cannot reliably perform multi-hop reasoning
    
- Cannot enforce strict filters without additional logic
    

---

## 2. Cypher Tool

Purpose: structured graph querying.

Used for:

- Attribute filtering
    
- Relationship traversal
    
- Deterministic domain queries
    
- Multi-hop graph exploration
    

How it works:

- LLM generates Cypher query
    
- Query runs against Memgraph
    
- Structured results are returned
    

Cypher is used when:

- Structure matters
    
- Relationships are important
    
- Filters must be exact
    

Cypher enables deterministic reasoning.

---

# Tool Selection

Vedana can choose which tool to use.

The LLM evaluates:

- Type of question
    
- Available anchor types
    
- Data model structure
    

It may choose:

- Vector search
    
- Cypher
    
- Hybrid approach
    

Example:

Question: "What are the opening hours of the Moscow branch?"

Correct behavior:

- Use Cypher (structured lookup)
    

Question: "What does the policy say about overtime?"

Correct behavior:

- Use vector search (document retrieval)
    

The agent selects tools dynamically.

---

# Hybrid Retrieval

Vedana supports combining tools.

Example flow:

1. Vector search retrieves candidate chunks
    
2. Cypher query narrows results by structure
    
3. LLM formats final answer
    

This enables both semantic flexibility and structural correctness.

---

# Extending Tools

Tools are extensible.

You can implement custom tools to:

- Query external APIs
    
- Perform calculations
    
- Integrate ERP systems
    
- Execute domain-specific logic
    

Custom tools must:

- Have clear input/output schema
    
- Be deterministic
    
- Be registered in the tool registry
    

(See: How to Write a Custom Tool)

---

# Playbooks and Tool Behavior

Tool usage can be guided.

Playbooks define:

- When tools should be used
    
- In what order
    
- Under which conditions
    
- What fallback behavior is allowed
    

You can instruct Vedana:

- Prefer Cypher over vector search
    
- Use vector search only for documents
    
- Never answer without tool evidence
    

Playbooks act as behavioral constraints for the agent.

---

# Agent Behavior Model

Vedana behaves like a constrained agent.

It can:

- Inspect available tools
    
- Choose a tool
    
- Execute tool
    
- Observe result
    
- Continue exploration
    

It cannot:

- Invent new tools
    
- Bypass tool restrictions
    
- Access data outside the declared model
    

---

# Determinism Boundary

Important separation:

- Tools are deterministic
    
- LLM is probabilistic
    

Truth comes from tools.  
Language formatting comes from the LLM.

If tool results are stable,  
structural correctness is stable.

---

# Summary

Vedana provides:

- Vector search for semantic retrieval
    
- Cypher for structured graph queries
    

The LLM acts as an agent that selects tools.

Tools can be extended.  
Behavior can be constrained via playbooks.

Tool usage defines how Vedana explores the world.