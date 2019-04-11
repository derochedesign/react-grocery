const { useState, useRef, useEffect, useContext} = React;

const ListContext = React.createContext({});

const ShoppingList = (props) => {
    
    console.log("refreshing ShoppingList");
     
    // const [qty, setQty] = useState([]);
    
    return (
        <ul className={props.classVal}>
        {
            props.items.map( (item, i) => 
                (props.currCat == item.cat || props.currCat == "all") && <ListItem key={i} i={i} item={item.val} id={item.id} cat={item.cat}/>
            )
        }
        </ul>
    )
}

const ListItem = props => {
    
    let newQty = useContext(ListContext);
    let thisItemIndex = newQty.data.findIndex(item => item.id == props.id);
    
    console.log("refreshing ListItem");
    
    const [qty, setQty] = useState(newQty.data[thisItemIndex].qty);
    newQty.data[thisItemIndex].qty = qty;
    newQty.update();
    
    const deleteItem = () => {
        let tempArr = newQty.data;
        tempArr.splice([thisItemIndex], 1);
        newQty.data = [...tempArr];
        newQty.update();
        console.log(newQty);
        
    }
    
    return (
        <li className={props.cat}>
            <button onClick={(qty > 1) && (() => setQty(qty - 1))}>-</button>
            <span>
                {`${qty} ${props.item}`}
                <button onClick={deleteItem} className="delete-button">x</button>
            </span>
            <button onClick={() => setQty(qty + 1)}>+</button>
        </li>
    )
}

const Categories = props => {
    
    console.log("refreshing Categories");
    
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

const Category = props => {
    
    console.log("refreshing Category");
    
    return (
        <li>
            <input type="radio" onClick={(e) => props.setCat(e.target.value)} name="category" value={props.cat} id={`filter${props.i}`} checked={(props.currCat === props.cat) && "checked" } />
            <label for={`filter${props.i}`}>{props.cat}</label>
        </li>
    )
}
const AddItem = props => {
    
    console.log("refreshing AddItem");
    
    const newItemInput = useRef();
    
    const handleSubmit = e => {
        let randomID = Math.floor(Math.random() * 1000000000);
        //make sure to check all id's for dup
        let newItem = {val: newItemInput.current.value, qty:1, cat: props.currCat, id:randomID};
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
    
    console.log("refreshing HeaderInfo");
    
    return (
        <header className="header">
            <h1>{props.theTitle}</h1>
        </header>
    )
}

const App = () => {
    
    console.log("refreshing App");
    // let listData = JSON.parse(localStorage.getItem('list')) || [];
    const [items, setItem] = useState([]);
    
    const [currCat, setCurrCat] = useState("all");
    
    const categories = [`all`, `meat`, `prod`, `dairy`, `dry`];
    const title = "Shopping List";
    
    useEffect(() => {
        document.title = `Grocery List: ${items.length} Items`;
    });
    
    const updateLocalStorage = () => {
        console.log("test");
        
    }

    return (
      <ListContext.Provider value={{ data: items, update:updateLocalStorage}}>
        <HeaderInfo theTitle={title}/>

        <form id="newItem" className="newitem" autocomplete="off">
            <label for="item" className="line-label">New Item</label>
            <AddItem items={items} setItem={setItem} currCat={currCat} />
        </form>
        
        <form id="filterCategories">
            <Categories classVal="filters" currCat={currCat} allCat={categories} setCat={setCurrCat} />
        </form>
        
        <ShoppingList setItem={setItem} items={items} classVal="shoppinglist" currCat={currCat} setCat={setCurrCat} />
      </ListContext.Provider>
    );
};

ReactDOM.render(<App />, document.getElementById('app'));