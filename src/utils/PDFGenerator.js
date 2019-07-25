import JsPDF from 'jspdf'
import 'jspdf-autotable'

export default function PDF (list, name, date) {
  const todo = list.filter(task => task.status === '1')
  const doing = list.filter(task => task.status === '2')
  const pending = list.filter(task => task.status === '3')
  const done = list.filter(task => task.status === '4')

  const doc = new JsPDF('l')

  doc.text(`Tarefas do mês ${date} - ${name}`, 90, 15)

  doc.text('FEITO', 2, 30)
  doc.autoTable(getColumns(), done, {
    startY: 35,
    margin: {horizontal: 2},
    bodyStyles: {valign: 'top'},
    styles: {overflow: 'linebreak', columnWidth: 'wrap', fillColor: [200, 230, 201]},
    headerStyles: {fontStyle: 'bold', textColor: 0, fillColor: [67, 160, 71]},
    columnStyles: {name: {columnWidth: 'auto'}, description: {columnWidth: 'auto'}}
  })

  doc.text('FAZENDO', 2, doc.autoTable.previous.finalY + 15)
  doc.autoTable(getColumns(), doing, {
    startY: doc.autoTable.previous.finalY + 20,
    margin: {horizontal: 2},
    bodyStyles: {valign: 'top'},
    styles: {overflow: 'linebreak', columnWidth: 'wrap', fillColor: [187, 222, 251]},
    headerStyles: {fontStyle: 'bold', textColor: 0, fillColor: [25, 118, 210]},
    columnStyles: {name: {columnWidth: 'auto'}, description: {columnWidth: 'auto'}}
  })

  doc.text('PENDENTE', 2, doc.autoTable.previous.finalY + 15)
  doc.autoTable(getColumns(), pending, {
    startY: doc.autoTable.previous.finalY + 20,
    margin: {horizontal: 2},
    bodyStyles: {valign: 'top'},
    styles: {overflow: 'linebreak', columnWidth: 'wrap', fillColor: [255, 205, 210]},
    headerStyles: {fontStyle: 'bold', textColor: 0, fillColor: [211, 47, 47]},
    columnStyles: {name: {columnWidth: 'auto'}, description: {columnWidth: 'auto'}}
  })

  doc.text('A FAZER', 2, doc.autoTable.previous.finalY + 15)
  doc.autoTable(getColumns(), todo, {
    startY: doc.autoTable.previous.finalY + 20,
    margin: {horizontal: 2},
    bodyStyles: {valign: 'top'},
    styles: {overflow: 'linebreak', columnWidth: 'wrap', fillColor: [255, 249, 196]},
    headerStyles: {fontStyle: 'bold', columnWidth: 'auto', textColor: 0, fillColor: [253, 216, 53]},
    columnStyles: {name: {columnWidth: 'auto'}, description: {columnWidth: 'auto'}}
  })

  return doc.save(`Tarefas_${name}_${date}.pdf`)
}

function getColumns () {
  return [
    {title: 'Nome da Tarefa', dataKey: 'name'},
    {title: 'Inicio', dataKey: 'started'},
    {title: 'Fim', dataKey: 'due'},
    {title: 'Descrição', dataKey: 'description'}
  ]
}
