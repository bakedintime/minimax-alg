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
        var visualizer = this;
        //Escribir al directorio
        var jsonContents = JSON.stringify(this.graph);
        //Llamada al webserver para guardar el archivo
        $.ajax({
            dataType:'json',
            url:'/saveResults',
            type:'POST',
            data:jsonContents,
            success:function(response){
                console.log(response.success);
                visualizer.showGraph(response.success);
            },
            error:function(){
                alert('No ha sido posible guardar el contenido del algoritmo Minimax.');
            }
        });
    };
    this.showGraph = function (filename){
        treeLoader = new FileLoader(filename);
    };
}

var root;
//Loads tree configuration from setup file
$.getJSON( "config/setup.json", function( data ) {
    $.each(data["nodes"], function(key,val){
        eval('window[\''+val["name"]+'\'] = new Node(\''+val["name"]+'\', \''+val["value"]+'\')');
    });
    $.each(data["relations"], function(key,val){
        eval(val["parent"]+'.addChildren('+val["children"]+')');
    });
    root = eval(data.root);

    var minimax = new Minimax();
    minimax.dfs(root);
    minimax.bestPath = minimax.generateBestPath(root, root.getValue());

    var graphVisualizer = new GraphVisualizer(minimax.bestPath);
    var jsonTree = graphVisualizer.buildGraph(root);
    graphVisualizer.generateGraph(jsonTree);
});


