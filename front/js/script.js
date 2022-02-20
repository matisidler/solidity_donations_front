import { ethers } from "./ethers.js";
import { donations, provider } from "./donations.js"

window.ethereum.on("accountsChanged", (accounts) =>{
    console.log("new account!!!", accounts[0])
    const acc = accounts[0]
    console.log("length uwu", accounts.length)
    if (accounts.length == 0){
        const newText = `<p class="form_txt" id="currentAdr">Not connected</p>`
        let divToReplace = document.getElementById("currentAdr")
        let frag = document.createRange().createContextualFragment(newText)
        document.getElementById('form').replaceChild(frag, divToReplace)
        console.log("la puta madre debería llegar")
        return
    }
    const newText = `<p class="form_txt" id="currentAdr">${acc}</p>`
    let divToReplace = document.getElementById("currentAdr")
    let frag = document.createRange().createContextualFragment(newText)
    document.getElementById('form').replaceChild(frag, divToReplace)

})

let textInput;
window.onload = async () =>{
try{
    let signer = provider.getSigner()
    console.log(await signer.getAddress())
    signer = await signer.getAddress()
    const newText = `<p class="form_txt" id="currentAdr">${signer}</p>`
    let divToReplace = document.getElementById("currentAdr")
    let frag = document.createRange().createContextualFragment(newText)
    document.getElementById('form').replaceChild(frag, divToReplace)
}catch(e){
    console.log("signer not found", e)
           const newText = `<p class="form_txt" id="currentAdr">Not connected</p>`
        let divToReplace = document.getElementById("currentAdr")
        let frag = document.createRange().createContextualFragment(newText)
        document.getElementById('form').replaceChild(frag, divToReplace)

}
const benefitedsAdr = await donations.GetAllBenefited()
  if (benefitedsAdr == undefined){
      return
  }
  benefitedsAdr.forEach(async function(value){
    if (value == "0x0000000000000000000000000000000000000000"){
        return
    } 
    let benefitedStruct = await donations.GetBenefitedByAdr(value)
    console.log("data to change: ",benefitedStruct)
    let data = {
        adr: value,
        desc: benefitedStruct[3],
        collected: ethers.utils.formatEther(benefitedStruct[1]),
        target: ethers.utils.formatEther(benefitedStruct[2]),
        input_id: value
    }
    const newProject = addProject(data)
    document.getElementById('list_projects').insertAdjacentHTML("afterbegin", newProject)
  })
}

//GET STARTED BUTTON
const buttonStarted = document.getElementById('started')
buttonStarted.addEventListener("click", async () => {
    try {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner()
        console.log(await signer.getAddress())
        document.getElementById("list_projects").scrollIntoView({behavior: 'smooth'})
        const sig = await signer.getAddress()
        const newText = `<p class="form_txt" id="currentAdr">${sig}</p>`
        let divToReplace = document.getElementById("currentAdr")
        let frag = document.createRange().createContextualFragment(newText)
        document.getElementById('form').replaceChild(frag, divToReplace)


    }catch(e){
        alert("it seems like we don't have permissions to open your metamask extension, please do it manually.")
    }
})

//listening for new benefiteds

donations.on("NewBenefited", (adr, description, collected, target) => {
console.log("HOLA??", adr, description, collected, target)
        let data = {
            adr: adr,
            desc: description,
            collected: ethers.utils.formatEther(collected),
            target: ethers.utils.formatEther(target),
            input_id: adr
        }
        //if a benefited was found, add it to benefitedList and execute "addProject" function
        console.log("descrip:", adr, description, collected, target)
        const newProject = addProject(data)
        document.getElementById('list_projects').insertAdjacentHTML("afterbegin", newProject)
        console.log("andaaaaaaaa")
})
donations.on("NewDonation", (donator, benefited, amountReceived, collected, target) => {
    const parent = document.getElementById(benefited)
    const children = parent.querySelector('.project_description').textContent
    
    console.log(donator, benefited, ethers.utils.formatEther(amountReceived), ethers.utils.formatEther(collected), ethers.utils.formatEther(target))
    let data = {
        adr: benefited,
        desc: children,
        collected: ethers.utils.formatEther(collected),
        target: ethers.utils.formatEther(target),
        input_id: benefited
    }
    if (target <= collected) {
        data.target = "COMPLETED"
    }
    alert("TX completed! thanks for donating")
    const newProject = addProject(data)
    let divToReplace = document.getElementById(data.adr)
    let frag = document.createRange().createContextualFragment(newProject)
    document.getElementById('list_projects').replaceChild(frag, divToReplace)
})

document.addEventListener("click", async (e) => {
    console.log(e.target.className)
    const [firstClass, secondClass] = e.target.className.split(" ")
    let signal = false
    let desc = undefined
    let target = undefined
    if (firstClass === "donate"){
        if (secondClass == "submit"){
            [desc, target] = document.getElementsByClassName("addProject")
            console.log("MUY BIEN LLEGA HASTA ACA")
            if (desc.value == ""){
                alert("please, set a description")
                return
            }
            if (target.value == ""){
                alert("please, set a target")
                return
            }
            signal = true
            
        }else {
            [textInput] = document.getElementsByClassName(secondClass)
            if (textInput.value == "") {
                alert("send some value")
                return
            }
        }

        await provider.send("eth_requestAccounts", []);
        let signer = provider.getSigner()
        console.log(await signer.getAddress())
    
        const txWithSigner = donations.connect(signer)

        try{
            let options = undefined
            let tx = undefined
            if (signal == true){
                signer = await signer.getAddress()
                
                console.log("signerrr", signer.toString(), target.value, desc.value)
                options = {gasLimit:2100000, gasPrice: 8000000000}
                tx = await txWithSigner.AddBenefited(signer.toString(), ethers.utils.parseEther(target.value), desc.value, options)
                
            }else{
                options = {value: ethers.utils.parseEther(textInput.value), gasLimit:2100000, gasPrice: 8000000000}
                tx = await txWithSigner.ReceiveDonations(secondClass, options)
            }
            console.log("tx papa:" ,tx.hash)
            const a = await provider.getTransaction(tx.hash)
            const getBlockNumber = await provider.call(a, a.blockNumber)
            console.log(getBlockNumber)
        }catch(e){
            console.log("error acá!!!")
            alert(e.error.message)
            return
        }
        alert("please wait until the tx is confirmed!")
    }
    

} )


const addProject = (data) => {
    return `
    <div class="project" id ="${data.adr}">
    <h3 class="project_name">${data.adr}</h3>
    <p class="project_description">${data.desc}</p>
    <p class="target">Target: ${data.target} ${checkCollected(data.target)}</p>
    <p class="collected">Collected: ${data.collected} ETH</p>
    <div class="values">
        <input class="input ${data.input_id}"type="text" placeholder="SET AMOUNT"> <p class="eth_text">ETH</p>
    </div>
    <button class="donate ${data.input_id}">DONATE</button>
</div>`
} 

function checkCollected(param){
    console.log("param")
    console.log(param)
    console.log(param == "COMPLETED")
    let res = "ETH"
    if (param == "COMPLETED"){
        res = ""
    }
    return res
}
//HACER UN EVENT LISTENER QUE ESCUCHE CUANDO HAYA UNA NUEVA DONACIÓN Y QUE ACTUALICE EL PRECIO DE LA PÁGINA

//ver por qué cuando un address ya existe, pero fue completada, no se emite el evento de NewDonation, o por que el front no lo agarra-
// primero deployar el SC de nuevo. 

// Error: Error: cannot estimate gas; transaction may fail or may require manual gas limit (error={"code":-32603,"message":"execution reverted: