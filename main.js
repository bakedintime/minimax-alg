/** main.js **/
function Minimax(){
    this.bestPath = [];

    this.dfs = function (node, level) {
        level = typeof level !== 'undefined' ? level : 1;
        if (!node.hasChildren()) {
            return node.getValue();
        }
        var i, children = node.getChildren(), child, childValue;
        for (i = 0; i < children.length; i += 1) {
            child = children[i];
            childValue = this.dfs(child, level+1);
            if (node.getValue() ==='unset' && i === (children.length-1)) {
                //Si el nodo padre no tiene ningun valor asignado
                // y es el ultimo hijo; devolver su valor al padre.
                return node.getValue();
            }else if (node.getValue() === 'unset' && i !== (children.length-1)){
                //Si el nodo padre no tiene ningun valor asignado
                // pero no es el ultimo hijo; asignar su valor al padre y continuar.
                node.setValue(childValue);
            }else if (node.getValue() !== 'unset' && i === (children.length-1)){
                //Si el nodo padre tiene un valor asignado 
                // y es el ultimo hijo; asignar el mejor valor al padre y devolverlo.
                if (this.isMin(level)){
                    node.setValue(Math.min(node.getValue(), childValue));
                }else{
                    node.setValue(Math.max(node.getValue(), childValue));
                }
                return node.getValue();
            }else if (node.getValue() !== 'unset' && i !== (children.length-1)){
                // Si el nodo padre tiene un valor asignado
                // pero no es el ultimo hijo; asignar el mejor valor al padre y continuar
                if (this.isMin(level)){
                    node.setValue(Math.min(node.getValue(), childValue));
                }else{
                    node.setValue(Math.max(node.getValue(), childValue));
                }
            }
        }
    };

    this.isMin = function(level){
        return level % 2 === 0;
    };

    this.generateBestPath = function(node, rootValue){
        var bestPath = [];
        if (!node.hasChildren()) {
            bestPath.push(node.getName());
            return bestPath;
        }
        bestPath.push(node.getName());
        var i, children = node.getChildren(), child;
        for (i = 0; i < children.length; i += 1) {
            child = children[i];
            if (child.getValue() === rootValue){
                childBestPath = this.generateBestPath(child, rootValue);
                bestPath = bestPath.concat(childBestPath);
            }
        }
        return bestPath;
    };
}

function  Node(givenName, givenValue) {
    this.children = [];
    this.value = givenValue;
    this.name = givenName;

    this.addChildren = function () {
        for (var i = 0; i < arguments.length; i++) {
            this.children.push(arguments[i]);
        }
    };

    this.hasChildren = function () {
        return this.children.length > 0;
    };

    this.getChildren = function () {
        return this.children;
    };

    this.getName = function(){
        return this.name;
    };

    this.setValue = function(newValue){
        this.value = newValue;
    };

    this.getValue = function () {
        return this.value;
    };
}

function GraphVisualizer(bestPath){
    this.graph = {};
    this.bestPath = bestPath;
    this.buildGraph = function(node){
        var isBestPath = ($.inArray(node.getName(), this.bestPath) > -1);
        var nodeDescription = {
            "name":node.getName() + " ("+ node.getValue() +")",
            "children":[],
            "size":1,
            "isBestPath": isBestPath
        };
        if (!node.hasChildren()) {
            nodeDescription["name"] = node.getName() + " ("+ node.getValue() +")";
            nodeDescription["size"] = node.getValue();
            return nodeDescription;
        }
        var i, children = node.getChildren(), child;
        for (i = 0; i < children.length; i += 1) {
            child = children[i];
            childDescription = this.buildGraph(child);
            nodeDescription["children"].push(childDescription);
        }
        return nodeDescription;
    };
    this.generateGraph = function(jsonObject){
        this.graph = jsonObject;
        //Escribir al directorio
        var jsonContents = JSON.stringify(this.graph);
        var blob = new Blob([jsonContents], {type: "text/plain;charset=utf-8"});
        var filename = 'jsonTree.json';
        saveAs(blob, filename);

        this.showGraph('jsonTree.json');
    };
    this.showGraph = function (filename){
        treeLoader = new FileLoader(filename);
    };
}

// TODO: Leer archivo y cargar configuracion
var node1 = new Node('node1', 'unset');
var node2 = new Node('node2', 'unset');
var node3 = new Node('node3', 'unset');
var node4 = new Node('node4', 4);
var node5 = new Node('node5', 5);
var node6 = new Node('node6', 6);
var node7 = new Node('node7', 7);
var node8 = new Node('node8', 'unset');
var node9 = new Node('node9', 'unset');
var node10 = new Node('node10', 10);
var node11 = new Node('node11', 11);
var node12 = new Node('node12', 12);

node1.addChildren(node2, node7, node8);
node2.addChildren(node3, node6);
node3.addChildren(node4, node5);
node8.addChildren(node9, node12);
node9.addChildren(node10, node11);

var root = node1;

var minimax = new Minimax();
minimax.dfs(root);
minimax.bestPath = minimax.generateBestPath(root, root.getValue());

var graphVisualizer = new GraphVisualizer(minimax.bestPath);
var jsonTree = graphVisualizer.buildGraph(root);
graphVisualizer.generateGraph(jsonTree);