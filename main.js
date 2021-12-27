//61c661ad2f066d2967414601 helado - frutilla
//61c661d52f066d2967414603 hamburguesa -tomate,palta.mayo
//61c661ed2f066d2967414605 helado , tomate palta mayo
let mealsState=[]

const stringToHTML= (s) => {
    const parser=new DOMParser()
    const doc=parser.parseFromString(s,'text/html')
    return doc.body.firstChild //es el primer elemento de la etiqueta body
}
const renderItem=(item)=>{
    const element=stringToHTML(`<li data-id="${item._id}">${item.name}</li>`)
    //return `<li data-id="${item._id}">${item.name}</li>`//alt grs c rara botno cierre corchea
    element.addEventListener('click',()=> {
        const mealsList=document.getElementById('meals-list')
        Array.from(mealsList.children).forEach(x=> x.classList.remove('selected'))
        element.classList.add('selected')
        const mealsIdInput= document.getElementById('meals-id')
        mealsIdInput.value=item._id
        
    })
    return element
}
const renderOrder =(order,meals)=> {
    const meal=meals.find(meal=> meal._id===order.meal_id)
    const element=stringToHTML(`<li data-id="${order._id}">${meal.name}-${order.user_id}</li>`)
    return element
}
    window.onload=()=>{
        const orderForm= document.getElementById('order')
        orderForm.onsubmit=(e)=> {
            e.preventDefault()
            const submit = document.getElementById('submit')
            submit.setAttribute('disabled',true)
            const mealId=document.getElementById('meals-id')
            const mealIdValue=mealId.value
            if (!mealIdValue)
            {
                alert('Debe seleccionar un plato')
                return
            }
            const order={
                meal_id: mealIdValue,
                user_id:'chanchito gato'
            }

            fetch('https://serverless-cpalacios17-santotomasc.vercel.app/api/orders',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order)
            }).then(x=>x.json())
            .then(respuesta=>{
                const renderedOrder=renderOrder(respuesta,mealsState)
                const ordersList=document.getElementById('orders-list')
                ordersList.appendChild(renderedOrder)
                submit.removeAttribute('disabled')
            })
        }
        
    fetch('https://serverless-cpalacios17-santotomasc.vercel.app/api/meals')
        .then(response=>response.json())
        .then(data=>{
        mealsState=data
        const mealsList=document.getElementById('meals-list')
        const submit=document.getElementById('submit')
        const listItems=data.map(renderItem)
        mealsList.removeChild(mealsList.firstElementChild) //devuelve el primer hijo para ser eliminado luego
        listItems.forEach(element=>mealsList.appendChild(element))
        submit.removeAttribute('disabled')
        
        fetch('https://serverless-cpalacios17-santotomasc.vercel.app/api/orders')
            .then(response => response.json())
            .then(ordersData=>{
                const ordersList=document.getElementById('orders-list')
                const listOrders=ordersData.map(orderData=>renderOrder(orderData,data))

                ordersList.removeChild(ordersList.firstElementChild)
                listOrders.forEach(element => ordersList.appendChild(element))
                
            })
        })

}