export async function getFields(viitetyyppi) {
  try {
    let obj = {"viitetyyppi": viitetyyppi};
    let response = await fetch("http://127.0.0.1:3000/maarittelyt", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }
      
      // Otetaan vastauksena saadut kentät
      let result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
      return null
  }
  
}
