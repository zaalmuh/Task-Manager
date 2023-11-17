const taskTitle = document.getElementsByClassName('task-title');
const detail = document.getElementsByClassName('detail');

for (let index = 0; index < taskTitle.length; index++) {
  taskTitle[index].addEventListener('click', () => {
    detail[index].showModal();
  });
  taskTitle[index].addEventListener('hover', () => {
    detail[index].showModal();
  });
}
// taskTitle.addEventListener('click', () => {
//   detail.showModal();
// });
