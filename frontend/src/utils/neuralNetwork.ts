// logical OR rules
const random = () => Math.random();

// Исходные данные, которые будут определять что именно мы хотим от нейросети
const data = [
  { input: [0, 0], output: 0 },
  { input: [0, 1], output: 1 },
  { input: [1, 0], output: 1 },
  { input: [1, 1], output: 1 },
];

// Веса для ребер будущих нейронов
const weights = {
  // Первый  слой - входящие  данные [0, 0], [0, 1] и т д
  i1_h1: random(),
  i1_h2: random(),
  // Второй слой - скрытый слой нейронов где творится вся магия
  i2_h1: random(),
  i2_h2: random(),
  // Третий выходной слой с результатом работы сети
  h1_o1: random(),
  h2_o1: random(),
  // Дополнительные веса смещения, необходимые для прогресса в обучении сети(оказывается без них мы просто повторяем раз за разом одну и туже итерацию обучения и прогресс никогда не наступает)
  bias_h1: random(),
  bias_h2: random(),
  bias_o1: random(),
};

// Функция акцивации - вызывем ее для обработки входных данных внутри каждого нейрона
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
// Первая произодная от функции активации
const derivate_sigmoid = (x: number) => {
  const fx = sigmoid(x);
  return fx * (1 - fx);
};

// 1   2   3
// 0 - 0 \
//   Х     0 -
// 0 - 0 /
//
// 1 - [0, 0], [0, 1], [1, 0] и т д
// 2 - []

// Функция нейронной сети, параметры - это входные данные 1 слоя
const neuralNetwork = (i1: number, i2: number) => {
  // Входное значение первого нейрона второго слоя
  // weights.i2_h1 * i2 всего одно слагаемое из-за того что у нас только 2 нейрона на втором слое, если бы нейронов было 3 и больше то и значений было бы больше
  const h1_input = weights.i1_h1 * i1 + weights.i2_h1 * i2 + weights.bias_h1;
  // Вычисляем выходное значение из первого нейнорона второго слоя
  const h1 = sigmoid(h1_input);

  // Входное значение второго нейрона второго слоя
  const h2_input = weights.i1_h2 * i1 + weights.i2_h2 * i2 + weights.bias_h2;
  // Вычисляем выходное значение из второго нейнорона второго слоя
  const h2 = sigmoid(h2_input);

  // Входное значение нейрона третьего слоя
  const o1_input = weights.h1_o1 * h1 + weights.h2_o1 * h2 + weights.bias_o1;
  // Вычисляем выходное значение нейрона 3го слоя - наш результат
  const o1 = sigmoid(o1_input);

  return {
    o1,
    h1,
    h2,
    h1_input,
    h2_input,
    o1_input,
  };
};

const showResult = () => {
  data.forEach((it) => {
    const [i1, i2] = it.input;
    const { o1 } = neuralNetwork(i1, i2);
    console.log('[Result: ', o1, '; Expected: ', it.output, ']');
  });
};

showResult();

// Тренируем нашу сеть
const train = () => {
  // Дельты весов для прогресса обучения - будем на каждом цикле обучения искать прогрессию ближе и и ближе к искомому результату
  const weights_delta = {
    i1_h1: 0,
    i1_h2: 0,
    i2_h1: 0,
    i2_h2: 0,
    h1_o1: 0,
    h2_o1: 0,
    bias_h1: 0,
    bias_h2: 0,
    bias_o1: 0,
  };

  // Обходим все наши входные данные
  for (const {
    input: [i1, i2],
    output,
  } of data) {
    // Прогоняем их через сеть
    const { o1, o1_input, h1, h2, h1_input, h2_input } = neuralNetwork(i1, i2);

    // Вычисляем дельту от искомого результата и того что отдала нам сеть, как это значение и направляет циклы обучения в правильную сторону
    const delta = output - o1;

    // Вычислем дельты весов для каждого нейрона используя квадратичное уравнение(первая производная от сигмоида)
    const o1_delta = delta * derivate_sigmoid(o1_input);
    weights_delta.h1_o1 += h1 * o1_delta;
    weights_delta.h2_o1 += h2 * o1_delta;
    weights_delta.bias_o1 += o1_delta;

    const h1_delta = o1_delta * derivate_sigmoid(h1_input);
    weights_delta.i1_h1 += i1 * h1_delta;
    weights_delta.i2_h1 += i2 * h1_delta;
    weights_delta.bias_h1 += h1_delta;

    const h2_delta = o1_delta * derivate_sigmoid(h2_input);
    weights_delta.i1_h2 += i1 * h2_delta;
    weights_delta.i2_h2 += i2 * h2_delta;
    weights_delta.bias_h2 += h2_delta;
  }

  return weights_delta;
};

// Обновляем наши искомые веса, приоритизируем их значения, потом будет итерировать обучение
const applyTrainUpdate = (deltas: any) => {
  Object.keys(weights).forEach((key) => {
    (weights as any)[key] += (deltas as any)[key];
  });
};

applyTrainUpdate(train());
console.log('/********************************* 1 train/');
showResult();

for (let i = 0; i < 100; i++) {
  applyTrainUpdate(train());
}
console.log('/********************************* 100 trains/');
showResult();

for (let i = 0; i < 1000; i++) {
  applyTrainUpdate(train());
}
console.log('/********************************* 1000 trains/');
showResult();

for (let i = 0; i < 10000; i++) {
  applyTrainUpdate(train());
}
console.log('/********************************* 10000 trains/');
showResult();
