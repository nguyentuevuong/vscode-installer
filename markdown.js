const { readFileSync } = require('node:fs')

const unorderedList = /^- [\S\s]*?(?=^ *\n^(?!( *- | *\n))|^\d\. )|^- [\S\s]*/gm

let html = readFileSync('./sample.txt', { encoding: 'utf-8' })

// Unordered list
html = html.replace(unorderedList, (match) => {
  // console.log("unordered list match: ", match);
  const listItemMatches = match.match(
    /(?:^ {0,1}- +)[\s\S]*?(?=\n(?=^ {0,1}- +))|(?:^ {0,1}- +)[\s\S]*/gm
  )
  // console.log(listItemMatches);
  let listItems = ''
  listItemMatches.forEach((item) => {
    // console.log("list item match:", item.replace(/ /gm, "_"));
    const itemClean = item.replace(/\n(?!(?: {2,}|\t*)- +)/gm, ' ').replace(/^ {0,1}- +/g, '')
    // console.log("list item clean:", itemClean.replace(/ /gm, "_"));
    let itemWithNestedList = itemClean
    let loops = 0
    while (
      /(?:^ {2,}|\t)- +[\s\S]+?(?=\n(?=- )|<\/li>)|(?:^ {2,}|\t)- +[\s\S]+/m.test(
        itemWithNestedList
      )
    ) {
      if (loops >= 50) break
      itemWithNestedList = itemWithNestedList.replace(
        /(?:^ {2,}|\t)- +[\s\S]+?(?=\n(?=- )|<\/li>)|(?:^ {2,}|\t)- +[\s\S]+/m,
        (match) => {
          // console.log("nested list match:", match.replace(/ /gm, "_"));
          const nestedListBody = match.replace(/^ {0,2}/gm, '').replace(/^\t/gm, '')
          // console.log("nested list body:", nestedListBody.replace(/ /gm, "_"));
          const nestedULItemMatches = nestedListBody.match(
            /(?:^ {0,1}- +)[\s\S]*?(?=\n(?=^ {0,1}- +))|(?:^ {0,1}- +)[\s\S]*/gm
          )
          let nestedListItems = ''

          nestedULItemMatches.forEach((nestedListItem) => {
            // console.log("nested list item:", nestedListItem.replace(/ /gm, "_"));
            const nestedListItemClean = nestedListItem
              .replace(/\n(?!(?: {2,}|\t*)- +)/gm, ' ')
              .replace(/^ {0,1}- +/g, '')
            // console.log("nested list item clean:", nestedListItemClean.replace(/ /gm, "_"));
            nestedListItems += `<li>${nestedListItemClean}</li>`
          })

          return `<ul>${nestedListItems}</ul>`
        }
      )
      loops++
    }
    listItems += `<li>${itemWithNestedList}</li>`
  })

  return `<ul>${listItems}</ul>`.replace(/\n/g, '')
})

console.log(html)
