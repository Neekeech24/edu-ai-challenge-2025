# Sample Outputs

This document contains example runs of the Product Search Tool, where the filtering is performed entirely by the OpenAI model.

## Example 1: Complex Query (Multiple Criteria)

**User Query:** "Kitchen in stock over 4.5"

**Output:**
```
Filtered Products:
1. Air Fryer - $89.99, Rating: 4.6, In Stock
2. Pressure Cooker - $99.99, Rating: 4.7, In Stock
```

## Example 2: Natural Language Nuance

**User Query:** "clothes not in stock"

**Output:**
```
Filtered Products:
1. Women's Jacket - $79.99, Rating: 4.5, Out of Stock
```

## Example 3: Price Ceiling

**User Query:** "Kitchen under 100"

**Output:**
```
Filtered Products:
1. Blender - $49.99, Rating: 4.2, In Stock
2. Air Fryer - $89.99, Rating: 4.6, In Stock
3. Coffee Maker - $79.99, Rating: 4.3, In Stock
4. Toaster - $29.99, Rating: 4.1, In Stock
5. Electric Kettle - $39.99, Rating: 4.4, In Stock
6. Rice Cooker - $59.99, Rating: 4.3, In Stock
7. Pressure Cooker - $99.99, Rating: 4.7, In Stock
```

## Example 4: Simple Category Search

**User Query:** "Phone"

**Output:**
```
Filtered Products:
1. Smartphone - $799.99, Rating: 4.5, Out of Stock
```
