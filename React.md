# 1. useState
## 1.1 set 函数
仅更新下一次渲染的状态变量。如果在调用 set 函数后读取状态变量，则仍然会得到旧的值。如果需要使用下一个状态，可以将其保存在变量中。
### 1.1.1 例子：
`const nextCount = count + 1;//使用这个变量
setCount(nextCount);
console.log(count); // 0
console.log(nextCount); // 1`

## 1.2 setAge(a => a + 1)与setAge( a + 1)区别：
### 1.2.1 结论
setAge(a => a + 1)拿到的是最新的状态，即使在快速连续多次更新时，也不会用到过时的值。适合基于当前状态进行计算时使用。
setAge( a + 1)则是当前渲染时刻的状态值，不会考虑状态是否在同一渲染中已经被更新，适合不依赖最新状态值的场景。
React官方也推荐编写时首选使用更新器，可实现根据之前的状态更新状态，比如setAge(a => a + 1)。

### 1.2.2 为什么
这是因为 setAge(a => a + 1) 使用了 "函数式更新"（functional update），它是 React useState 的一个特性，专门用来确保在异步状态更新时，总能拿到最新的状态值。
如果我们直接用当前 age，可能会因为闭包拿到过期的状态值。这就是React 中的闭包陷阱。
闭包陷阱：在 React 中，函数组件中的状态和变量是“闭包”中的值。
当一个函数（如 handleClick）在组件渲染时被创建，它会捕获当时的状态和变量的快照。
如果状态更新是异步的，这个函数里的状态值可能会滞后于最新状态，导致你用的是过期的状态值。
### 1.2.3 例子
#### 1.2.3.1 setAge(a => a + 1)

`const [age, setAge] = useState(0);
const handleClick = () => {
  setAge(a => a + 1); // 基于最新的 age 更新，确保不会丢失更新
  setAge(a => a + 1); // 第二次更新也基于最新 age
 };
handleClick();
console.log(age); // 结果是 2`

#### 1.2.3.2 setAge( a + 1)
`const [age, setAge] = useState(0);
const handleClick = () => {
  setAge(age + 1); // 基于当前 age = 0 更新
  setAge(age + 1); // 再次基于当前 age = 0 更新
};
handleClick();
console.log(age); // 结果是 1（不是 2！）`
## 1.3 更新状态中的对象和数组
### 1.3.1 例子
#### 1.3.1.1 正确更新状态中的对象例子（解构 + 新属性，或覆盖原属性来创建一个新对象）
`setForm({
...form,
firstName: 'Taylor'
});`
#### 1.3.2.1 正确更新状态中的数组例子（解构 + 新属性，或覆盖原属性来创建一个新数组）
`setTodos([
...todos,
{
id: nextId++,
title: title,
done: false
}
]);`
#### 1.3.3.1 错误例子
`const [form, setForm] = useState({ firstName: 'Alice' });
const handleChange = () => {
  form.firstName = 'Taylor'; // ❌ 直接修改状态对象
  console.log(form.firstName); // Taylor ✅，但是状态实际上没更新！
};`
### 1.3.2 正确写法与错误写法的分析
### 1.3.2.1 分析
React 的状态是不可变的（Immutable）。在 React 中，useState 或 this.state 返回的状态对象是一个快照。你不能直接修改这个对象的属性，否则 React 不会检测到状态变化。
React 判断状态是否变化时，是比较对象引用（Object.is()）。如果直接修改对象属性，对象引用没变，React 以为状态没变，就不会重新渲染。 所以即使改了属性，UI 也不会自动更新。对象的引用会在创建一个新对象或者新数组时发生变化。还会在使用解构、spread（...）、Array.map()、Array.filter() 等方法时变化。
依赖项的比较也是使用Object.is()。使用 useMemo 和 useCallback目的也是为了确保函数和对象引用不变。useMemo 和 useCallback 只有依赖不变时，才保持引用不变。

## 1.4 避免重新创建初始状态
### 1.4.1 例子
#### 1.4.1.1 正确例子（createInitialTodos为函数时）
`const [todos, setTodos] = useState(createInitialTodos);传函数，正确，只会在初始化时调用它`

#### 1.4.1.2 存在问题例子（createInitialTodos为函数时）
`const [todos, setTodos] = useState(createInitialTodos());传值，存在问题，除了初始渲染，仍会在每次渲染时调用此函数，进行不必要的计算，尤其是初始化逻辑可能比较复杂或昂贵的情况影响比较大。`

### 1.4.2 分析
为什么会这样？

useState 接收的参数如果是一个直接值，在每次渲染中都会被求值。虽然 React 会缓存状态值，但如果是一个常量，它每次都会重新传递给 useState。 所以每次渲染时，createInitialTodos() 都会执行，无论状态是否真的需要初始化。 只有第一次渲染时，useState 才会用这个值初始化状态，之后它会忽略这个参数。但这个函数仍然会在每次渲染时执行。useState 的接收的参数如果是一个函数会惰性求值，只会在第一次渲染时调用这个函数来初始化状态。后续渲染时，React 不会重新执行 someFunction，而是直接使用计算好的 fn状态值。
## 1.5 可使用key来重置状态
在 React 中，key 是一个特殊的属性，主要用于帮助 React 高效地识别哪些组件发生了变化、添加或移除。但它还有一个特别实用的功能：重置组件的内部状态。常用于需要重置组件状态的场景，比如表单（表单重置）、动画（动画重置）等。 
### 1.5.1 为什么
React 按 key 区分组件实例： 当 key 改变时，React 不会复用现有组件，而是销毁旧组件，重新创建一个新的组件实例。
组件被重新创建，状态也会重置： 新组件会从头执行初始化逻辑，包括 useState、useReducer、useRef 等钩子。
### 1.5.2 例子
`const [userId, setUserId] = useState(1);
function switchUser() {
  setUserId(userId === 1 ? 2 : 1);
}
function UserForm({ userId }) {
  const [name, setName] = useState('');
  return (
    <div key={userId}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={switchUser}>切换用户</button>
    </div>
  );
}
`
## 1.6 什么时候用 useRef？
✅ 需要存储数据，但不希望触发组件重新渲染
✅ 需要访问 DOM（如 input.focus()）
✅ 需要存储 上一次的 state 值
✅ 需要持久化数据，而不是在每次渲染时重置

## 1.7 什么时候用 useState？
✅需要触发 UI 更新时。
✅状态变化需要反映在界面上。
✅需要参与 React 生命周期和闭包。