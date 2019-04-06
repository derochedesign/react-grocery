const { useState, useRef, useEffect} = React;

const ShoppingList = (props) => {
    
    const [qty, setQty] = useState([]);
    
    return (
        <ul className={props.classVal}>
        {
            props.items.map( (item, i) => 
                (props.currCat == item.cat || props.currCat == "all") && <ListItem key={i} i={i} qty={qty} setQty={setQty} allItems={props.items} item={item.val} setItem={props.setItem} cat={item.cat}/>
            )
        }
        </ul>
    )
}

const ListItem = (props) => {
    
    let qtyArr = props.qty;
    
    const deleteItem = () => {
        let tempArr = props.allItems;
        tempArr.splice(props.i, 1);
        qtyArr.splice(props.i, 1);
        props.setItem([...tempArr]);
        props.setQty([...qtyArr]);
    }
    
    //default a new qty to 1
    (qtyArr[props.i] == undefined) ? qtyArr[props.i]=1 : qtyArr=qtyArr;
    
    return (
        <li className={props.cat}>
            <IncrementButton symb="-" qty={qtyArr} i={props.i} setQty={props.setQty} />
            <span>
                {`${qtyArr[props.i]} ${props.item}`}
                <button onClick={deleteItem} className="delete-button">x</button>
            </span>
            
            <IncrementButton symb="+" qty={qtyArr} i={props.i} setQty={props.setQty} />
        </li>
    )
}

const IncrementButton = (props) => {
    
    let qtyArr = props.qty;
    
    const updateQty = () => {
        let currQty = props.qty[props.i];
        
        if (!(currQty <= 1) && (props.symb == "-")) {
            currQty--;
            qtyArr[props.i] = currQty;
            props.setQty([...qtyArr]);
        }
        else if ((props.symb == "+")) {
            currQty++;
            qtyArr[props.i] = currQty;
            props.setQty([...qtyArr]);
        }
    }
    
    return (
        <button onClick={updateQty}>{props.symb}</button>
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
    return (
        <li>
            <input type="radio" onClick={(e) => props.setCat(e.target.value)} name="category" value={props.cat} id={`filter${props.i}`} checked={(props.currCat === props.cat) && "checked" } />
            <label for={`filter${props.i}`}>{props.cat}</label>
        </li>
    )
}
const AddItem = props => {
    const newItemInput = useRef();
    
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

const HeaderInfo = props => {
    return (
        <header className="header">
            <h1>{props.theTitle}</h1>
        </header>
    )
}

const App = () => {

    const [items, setItem] = useState([]);
    
    const [currCat, setCurrCat] = useState("all");
    
    const categories = [`all`, `meat`, `prod`, `dairy`, `dry`];
    const title = "Shopping List";
    
    useEffect(() => {
        document.title = `Grocery List: ${items.length} Items`;
    });

    return (
      <React.Fragment>
        <HeaderInfo theTitle={title}/>

        <form id="newItem" className="newitem" autocomplete="off">
            <label for="item" className="line-label">New Item</label>
            <AddItem items={items} setItem={setItem} currCat={currCat} />
        </form>
        
        <form id="filterCategories">
            <Categories classVal="filters" currCat={currCat} allCat={categories} setCat={setCurrCat} />
        </form>
        
        <ShoppingList setItem={setItem} items={items} classVal="shoppinglist" currCat={currCat} setCat={setCurrCat} />
      </React.Fragment>
    );
};

ReactDOM.render(<App />, document.getElementById('app'));