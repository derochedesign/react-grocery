const { useState, useRef, useEffect, useContext} = React;

const ListContext = React.createContext({});

//Some notes:
//Everything needs to refresh pretty much, which isnt great.
//Also I think my solution to solving this was to store the entire context in a state at App level.. seems bad, but works.
//Only thing that doesn't work, is when you delete an item, the qty sticks, which doesn't really make sense to me why but idk

const ShoppingList = (props) => {
    
    console.log("refreshing ShoppingList");
    let ctx = useContext(ListContext);
    
    const items = ctx.data;
    const currCat = ctx.cat;
    
    return (
        
        <ul className={props.classVal}>
        {
            items.map( (item, i) => 
                (currCat == item.cat || currCat == "all") && <ListItem key={i} i={i} item={item.val} id={item.id} cat={item.cat}/>
            )
        }
        </ul>
    )
}

const ListItem = props => {
    
    let ctx = useContext(ListContext);
    let thisItemIndex = ctx.data.findIndex(item => item.id == props.id)
    
    const [qty, setQty] = useState(ctx.data[thisItemIndex].qty);
    ctx.data[thisItemIndex].qty = qty;
    ctx.updateLS();
    
    const deleteItem = () => {
        
        let clone = {...ctx};
        let tempArr = ctx.data;
        tempArr.splice([thisItemIndex], 1);
        ctx.data = [...tempArr];
        clone.data = [...tempArr];
        ctx.update(clone);
        
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
    
    const [currCat, setCurrCat] = useState("all");
    const ctx = useContext(ListContext);
    
    const setCat = (val) => { 
        let clone = {...ctx};
        clone.cat = val;
        ctx.cat = val;
        setCurrCat(val);
        ctx.update(clone);
    }
    
    return (
        <ul className={props.classVal}>
        {
            ctx.allCat.map( (cat, i) => 
                <Category key={i} i={i} currCat={currCat} cat={cat} setCat={setCat}/>
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
const AddItem = () => {
    
    console.log("refreshing AddItem");
    
    const newItemInput = useRef();
    
    const ctx = useContext(ListContext);
    const items = ctx.data;
    const currCat = ctx.cat;
    
    const handleSubmit = e => {
        
        let randomID = Math.floor(Math.random() * 1000000000);
        //make sure to check all id's for dup
        let newItem = {val: newItemInput.current.value, qty:1, cat: currCat, id:randomID};
        let valid = items.filter( item => {
            let tempItem = newItem.val.toLowerCase();
            item.val = item.val.toLowerCase();
            return item.val == tempItem;
        });
        
        if (valid.length == 0) {
            let clone = {...ctx};
            clone.data = [...items, newItem];
            ctx.data = [...items, newItem];
            newItemInput.current.value = "";
            ctx.update(clone);
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
    let currCat = 'all';
    const categories = [`all`, `meat`, `prod`, `dairy`, `dry`];
    const title = "Shopping List";
    
    const updateLocalStorage = () => {
        console.log("update ls");
    }
    const updateApp = val => {
        console.log("update app"); 
        setTheStore(val);
    }
    
    const [theStore, setTheStore] = useState({ data: [], allCat:categories, cat: currCat, update:updateApp, updateLS:updateLocalStorage});
    // const items = [];
    
    //const [currCat, setCurrCat] = useState("all");
    
    useEffect(() => {
        document.title = `Grocery List: ${theStore.data.length} Items`;
    });

    return (
      <ListContext.Provider value={theStore}>
        <HeaderInfo theTitle={title}/>

        <form id="newItem" className="newitem" autocomplete="off">
            <label for="item" className="line-label">New Item</label>
            <AddItem />
        </form>
        
        <form id="filterCategories">
            <Categories classVal="filters" />
        </form>
        
        <ShoppingList classVal="shoppinglist" />
      </ListContext.Provider>
    );
};

ReactDOM.render(<App />, document.getElementById('app'));