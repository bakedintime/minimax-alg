###minimax-alg

# Requisites

+ Node js running
+ npm - Node package manager

# Setup

Minimax algorithm implementation with D3 visualization of results

It runs with Node JS.

To run issue this commands:

> $ npm install

> $ node webserver.js


# Configuration

To set a tree just modify the file setup.json, it has the following structure:
```json
{
  "root":"<name of root node>",
  "nodes":[ // Array of nodes
    {
      "name":"<node1>", // name of node
      "value":"<unset>" // value - unset if is not a leaf, value otherwise
    }
  ],
  "relations":[ // Array of relations
    {
      "parent":"<node1>" // name of parent node,
      "children":"<node2>, <node3>, <node4>" // List of children nodes
    }
  ]
}
```
or modified directly on the index.html the string that's on the textarea and update the tree.

# Using

The web server will start listening on localhost port 3000, with the url: localhost:3000/index.html

# Deployment

The project is deployed on Heroku: http://minimax-alg.herokuapp.com/index.html
