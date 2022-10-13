import { useEffect, useState } from "react";


function getLocalStorageData(key) {
   const stringifiedValue = localStorage.getItem(key)
   try {
    return JSON.parse(stringifiedValue);
  } catch {}
  return stringifiedValue;
}

function setLocalStorageData(key, value) {
  const stringifiedValue = JSON.stringify(value)
  localStorage.setItem(key, stringifiedValue);

}

export function useLocalStorage(key, initialValue = null) {

 const [state, setState] = useState(getLocalStorageData(key) || initialValue)

  useEffect(() => {

    setLocalStorageData(key, state)

  },[key, state]);

  
  useEffect(() => {
    function handleStorage(e){
      const newV = getLocalStorageData(key)
      setState(newV)
    }
    window.addEventListener('storage', handleStorage)

    return function cleanUp() {
      window.removeEventListener('storage', handleStorage)
    }
  
  }, [key])

  return [state, setState]
}

function Form() {
  
  const [name, setName] = useLocalStorage("name", "");
  console.log(name);

  return (
    <form style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor="name">Name:</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <h4>{name ? `Welcome, ${name}!` : "Enter your name"}</h4>
    </form>
  );
}

function FormWithObject() {
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  function handleChange(e) {
    setFormData(formData => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <form style={{ display: "flex", flexDirection: "column" }}>
      <label htmlFor="name">Title:</label>
      <input name="title" value={formData.title} onChange={handleChange} />
      <label htmlFor="name">Content:</label>
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
      />
    </form>
  );
}

export default function App() {
  return (
    <div>
      <h2>useLocalStorage can save string</h2>
      <Form />
      <hr />
      <h2>useLocalStorage can save objects (Bonus)</h2>
      <FormWithObject />
    </div>
  );
}
