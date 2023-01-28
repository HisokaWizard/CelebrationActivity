// logical OR rules
var random = function () { return Math.random(); };
var data = [
    { input: [0, 0], output: 0 },
    { input: [0, 1], output: 1 },
    { input: [1, 0], output: 1 },
    { input: [1, 1], output: 1 },
];
var weights = {
    i1_h1: random(),
    i1_h2: random(),
    i2_h1: random(),
    i2_h2: random(),
    h1_o1: random(),
    h2_o1: random(),
    bias_h1: random(),
    bias_h2: random(),
    bias_o1: random()
};
var sigmoid = function (x) { return 1 / (1 + Math.exp(-x)); };
var derivate_sigmoid = function (x) {
    var fx = sigmoid(x);
    return fx * (1 - fx);
};
var neuralNetwork = function (i1, i2) {
    var h1_input = weights.i1_h1 * i1 + weights.i2_h1 * i2 + weights.bias_h1;
    var h1 = sigmoid(h1_input);
    var h2_input = weights.i1_h2 * i1 + weights.i2_h2 * i2 + weights.bias_h2;
    var h2 = sigmoid(h2_input);
    var o1_input = weights.h1_o1 * h1 + weights.h2_o1 * h2 + weights.bias_o1;
    var o1 = sigmoid(o1_input);
    return {
        o1: o1,
        h1: h1,
        h2: h2,
        h1_input: h1_input,
        h2_input: h2_input,
        o1_input: o1_input
    };
};
var showResult = function () {
    data.forEach(function (it) {
        var _a = it.input, i1 = _a[0], i2 = _a[1];
        var o1 = neuralNetwork(i1, i2).o1;
        console.log('[Result: ', o1, '; Expected: ', it.output, ']');
    });
};
showResult();
var train = function () {
    var weights_delta = {
        i1_h1: 0,
        i1_h2: 0,
        i2_h1: 0,
        i2_h2: 0,
        h1_o1: 0,
        h2_o1: 0,
        bias_h1: 0,
        bias_h2: 0,
        bias_o1: 0
    };
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var _a = data_1[_i], _b = _a.input, i1 = _b[0], i2 = _b[1], output = _a.output;
        var _c = neuralNetwork(i1, i2), o1 = _c.o1, o1_input = _c.o1_input, h1 = _c.h1, h2 = _c.h2, h1_input = _c.h1_input, h2_input = _c.h2_input;
        var delta = output - o1;
        var o1_delta = delta * derivate_sigmoid(o1_input);
        weights_delta.h1_o1 += h1 * o1_delta;
        weights_delta.h2_o1 += h2 * o1_delta;
        weights_delta.bias_o1 += o1_delta;
        var h1_delta = o1_delta * derivate_sigmoid(h1_input);
        weights_delta.i1_h1 += i1 * h1_delta;
        weights_delta.i2_h1 += i2 * h1_delta;
        weights_delta.bias_h1 += h1_delta;
        var h2_delta = o1_delta * derivate_sigmoid(h2_input);
        weights_delta.i1_h2 += i1 * h2_delta;
        weights_delta.i2_h2 += i2 * h2_delta;
        weights_delta.bias_h2 += h2_delta;
    }
    return weights_delta;
};
var applyTrainUpdate = function (deltas) {
    Object.keys(weights).forEach(function (key) {
        weights[key] += deltas[key];
    });
};
applyTrainUpdate(train());
console.log('/********************************* 1 train/');
showResult();
for (var i = 0; i < 100; i++) {
    applyTrainUpdate(train());
}
console.log('/********************************* 100 trains/');
showResult();
for (var i = 0; i < 1000; i++) {
    applyTrainUpdate(train());
}
console.log('/********************************* 1000 trains/');
showResult();
for (var i = 0; i < 100000; i++) {
    applyTrainUpdate(train());
}
console.log('/********************************* 100000 trains/');
showResult();
