const meta_types = ['human','child','punk','police','inmate','cowboy','cowgirl','white ninja','black ninja','Galaxy Police','alien', 'Blockchain Zombie','robot','hologram','animighty']
const mafia_ids = [167,1086,1219,1409,1434,1717,2108,2713,3115,3196,3290,3440,3493,3525,3658,4216,4319,5104,5353,6124,6312,6411,6658,7492,7847,7860,8612,9728,10030]
var owners = new Set()
var mafia = []
var metas = []
var monkeys = []
var meta_count= []
var monkey_count = 0
var meta_fetches = []

function get_mafia() {
  /*fetch('https://api.opensea.io/api/v1/assets?token_ids=167&token_ids=1086&token_ids=1219&token_ids=1409&token_ids=1434&token_ids=1717&token_ids=2108&token_ids=2713&token_ids=3115&token_ids=3196&token_ids=3290&token_ids=3525&token_ids=3493&token_ids=3658&token_ids=3440&token_ids=4216&token_ids=4319&token_ids=5104&token_ids=5353&token_ids=6124&token_ids=6312&token_ids=6411&token_ids=6658&token_ids=7492&token_ids=7847&token_ids=7860&token_ids=8612&token_ids=9728&token_ids=10030&order_direction=desc&offset=0&limit=50&collection=animetas', {method: 'GET'})
    .then(response => response.json())
    .then(response => parse_mafia(response))
    .catch(err => console.error(err));*/
  return fetch('./data/mafia.json')
    .then(response => response.json())
    .then(response => parse_mafia(response))
    .catch(err => console.error(err))
}

function get_metas(owner_address) {
  /*fetch(`https://api.opensea.io/api/v1/assets?owner=${owner_address}&order_direction=desc&offset=0&limit=50&collection=animetas`, {method: 'GET'})
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));*/
  fetches.push(
    fetch(`./data/owners/${owner_address}.json`)
      .then(response => response.json())
      .then(response => parse_metas(response))
      .catch(err => console.error(err))
  )
}

function get_monkeys(owner_address) {
  /*fetch(`https://api.opensea.io/api/v1/assets?owner=${owner_address}&order_direction=desc&offset=0&limit=50&collection=animetas`, {method: 'GET'})
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));*/
  fetches.push(
    fetch(`./data/owners/${owner_address}_monkeys.json`)
      .then(response => response.json())
      .then(response => parse_monkeys(response))
      .catch(err => console.error(err))
  )
}

function parse_mafia(response) {
  mafia = response['assets']
  mafia.forEach(meta => {
    owners.add(meta['owner']['address'])
  })
}

function parse_metas(metas_json) {
  metas.push(metas_json['assets'])
}

function parse_metas(monkeys_json) {
  monkeys.push(monkeys_json['assets'])
}

function count_metas() {
  meta_types.forEach(type => {
    var count = 0
    metas.forEach(owner => {
      owner.forEach(meta => {
        meta["traits"].forEach(trait => {
          if(trait.value === type){
            count++
        } 
        })
      })
    })
    meta_count.push(
      {
        "name":type,
        "count":count
      }
    )
  })
}

function count_monkeys() {
  monkeys.forEach(owner => {
    owner.forEach(monkey => {
      monkey_count++
    } 
  })
}

function sort_metas() {
  metas.sort(function (a, b) {
    return b.length - a.length;
  });
}

function populate_count() {
  let tableRef = document.getElementById('meta_count').getElementsByTagName('tbody')[0]
  meta_count.forEach(meta_type => {
    let newRow = tableRef.insertRow(tableRef.rows.length)
    let nameCell = newRow.insertCell(0)
    nameCell.setAttribute('class', 'capitalize-first')
    let countCell = newRow.insertCell(1)
    let nameText = document.createTextNode(meta_type['name'])
    let countText = document.createTextNode(meta_type['count'])
    nameCell.appendChild(nameText)
    countCell.appendChild(countText)
  })
  let newRow = tableRef.insertRow(tableRef.rows.length)
  let nameCell = newRow.insertCell(0)
  let countCell = newRow.insertCell(1)
  let nameText = document.createTextNode('Animonkeys')
  let countText = document.createTextNode(monkey_count)
  nameCell.appendChild(nameText)
  countCell.appendChild(countText)
}

function populate_metas() {
  metas.forEach(owner => {
    let tableRef = document.getElementById('mafia_metas').getElementsByTagName('tbody')[0]
    let newRow = tableRef.insertRow(tableRef.rows.length)
    newRow.setAttribute('id', owner[0]['owner']['address'])
    let mafiaCell = newRow.insertCell(0)
    mafiaCell.setAttribute('class', 'py-3')
    let metasCell = newRow.insertCell(1)
    metasCell.setAttribute('class', 'text-left py-5')
    let nameHead = document.createElement('h5')
    let nameText = document.createTextNode(owner[0]['owner']['user']['username'])
    nameHead.appendChild(nameText)
    mafiaCell.appendChild(nameHead)
    var payroll_count = 0
    owner.forEach(meta => {
      let link = document.createElement('a')
      link.setAttribute('href', meta['permalink'])
      let image = document.createElement('img')
      if(mafia_ids.includes(parseInt(meta['token_id'])))
      {
        image.setAttribute('src', meta["image_thumbnail_url"])
        link.appendChild(image)
        mafiaCell.appendChild(link)
      }else{
        image.setAttribute('width', '64px')
        image.setAttribute('src', meta["image_thumbnail_url"])
        link.appendChild(image)
        metasCell.appendChild(link)
        payroll_count++
      }
    })
    let countPar = document.createElement('p')
    let countText = document.createTextNode(`Payroll: ${payroll_count} metas`)
    countPar.appendChild(countText)
    mafiaCell.appendChild(countPar)
  })
}

function populate_monkeys() {
  monkeys.forEach(owner => {
    let row = document.getElementById(owner[0]['owner']['address'])
    var monkey_count = 0
    owner.forEach(monkey => {
      let link = document.createElement('a')
      link.setAttribute('href', monkey['permalink'])
      let image = document.createElement('img')
      image.setAttribute('width', '64px')
      image.setAttribute('src', monkey["image_thumbnail_url"])
      link.appendChild(image)
      row.cells[1].appendChild(link)
      monkey_count++
    })
    let countPar = document.createElement('p')
    let countText = document.createTextNode(`Monkeys: ${monkey_count}`)
    countPar.appendChild(countText)
    row.cells[0].appendChild(countPar)
  })
}

var getMafia = get_mafia()
getMafia.then(function() {
  owners.forEach(owner => {
    get_metas(owner)
    get_monkeys(owner)
  })
  Promise.all(fetches).then(function() {
    count_metas()
    count_monkeys()
    sort_metas()
    populate_count()
    populate_metas()
    populate_monkeys()
  })
})
