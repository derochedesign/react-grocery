const { useState, useRef } = React;

const ShoppingList = (props) => {
    console.log("updating");
    
    return (
        <ul className={props.classVal}>
        {
            props.items.map( (item, i) => 
                <ListItem key={i} item={item.val} cat={item.cat} />
            )
        }
        </ul>
    )
}

const ListItem = (props) => {
    
    const [qty, setQty] = useState(1);
    
    return (
        <li className={props.cat}>
            <IncrementButton symb="-" currQty={qty} handleClick={setQty} />
            <span>{`${qty} ${props.item}`}</span>
            <IncrementButton symb="+" currQty={qty} handleClick={setQty} />
        </li>
    )
}

const IncrementButton = (props) => {
    
    const updateQty = () => {
        let currQty = props.currQty;
        if (props.symb == "-" && !(currQty <= 1)) {
            console.log(-1);
            props.handleClick(Number(currQty += -1));
        }
        else if (props.symb == "+") {
            console.log(1);
            props.handleClick(Number(currQty += 1));
        }
    }
    
    return (
        <button onClick={() => updateQty()}>{props.symb}</button>
    )
}

const Categories = (props) => {
    
    return (
        <ul className={props.classVal}>
        {
            props.allCat.map( (cat, i) => 
                <Category key={i} i={i} currCat={props.currCat} cat={cat} setCat={props.setCat}/>
            )
        }
        </ul>
    )
}

const Category = (props) => {
    
    const handleChange = (e) => {
        console.log(e.target.value);
        console.log("hell");
        props.setCat(e.target.value);
    }
    return (
        <li>
            <input type="radio" onClick={handleChange} name="category" value={props.cat} id={`filter${props.i}`} checked={(props.currCat === props.cat) && "checked" } />
            <label for={`filter${props.i}`}>{props.cat}</label>
        </li>
    )
}

const AddItem = (props) => {
    const newItemInput = useRef(null);
    
    const handleSubmit = (e) => {
        let newItem = {val: newItemInput.current.value, cat: props.currCat};
        let valid = props.items.filter( item => {
            let tempItem = newItem.val.toLowerCase();
            item.val = item.val.toLowerCase();
            return item.val == tempItem;
        });
        
        if (valid.length == 0) {
            props.setItem([...props.items, newItem]);
            newItemInput.current.value = "";
        }
        else {
            alert("Already on the list!");
        }
        e.preventDefault();
    }
    
    return (
        <div className="addnew">
            <input type="text" name="item" id="item" className="form-component inpt" ref={newItemInput} placeholder="What do you need?" />
            <input type="submit" value="Add" className="form-component btn" onClick={handleSubmit}/>
        </div>
    )
}

const App = () => {

    const [items, setItem] = useState([]);
    const [currCat, setCurrCat] = useState("all");
    
    const categories = [`all`, `meat`, `prod`, `dairy`, `dry`];

    return (
      <React.Fragment>
        <header className="header">
            <h1>Shopping List</h1>
        </header>

        <form id="newItem" className="newitem" autocomplete="off">
            <label for="item" className="line-label">New Item</label>
            <AddItem items={items} setItem={setItem} currCat={currCat} />
        </form>
        
        <form id="filterCategories">
            <Categories classVal="filters" currCat={currCat} allCat={categories} setCat={setCurrCat} />
        </form>
        
        <ShoppingList items={items} classVal="shoppinglist" setCat={setCurrCat} />
      </React.Fragment>
    );
};

ReactDOM.render(<App />, document.getElementById('app'));