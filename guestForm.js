import { createGuestList } from './data/guestdata.js'
// const createGuestList = require('./data/guestdata.js')

const guestList = createGuestList()
function guestForm() {
  //provide initial guests data list created from GuestManagement class
  let guests = guestList

  // 1. register event for searching and adding
  function registerEventHandling() {
    // ดึง element ที่ใช้สำหรับค้นหา (search input) จาก DOM
    let searchInput = document.getElementById('search-input')

    // เพิ่ม event listener สำหรับเหตุการณ์ keyup (การปล่อยปุ่มหลังจากกด) ใน input field สำหรับการค้นหา
    searchInput.addEventListener('keyup', searchGuest)

    // ดึง element ที่ใช้สำหรับเพิ่มแขกใหม่ (add guest button) จาก DOM
    let addGuestBtn = document.getElementById('add-guest-btn')

    // เพิ่ม event listener สำหรับเหตุการณ์ click ในปุ่มเพิ่มแขก
    addGuestBtn.addEventListener('click', addGuest)
  }


  // 2. Function to display one guest in the display area
  function displayGuest(guestItem) {
    //  ดึง element ที่ต้องการแสดงผล (display area) จาก DOM
    let displaylist = document.querySelector('#display-area')

    //  สร้าง HTML element สำหรับแขกแต่ละคน
    let guestdiv = document.createElement('div')

    // สร้าง HTML element สำหรับแสดงชื่อของแขก
    let name = document.createElement('span')
    name.textContent = `${guestItem.firstname} ${guestItem.lastname}`

    //  สร้าง HTML element สำหรับปุ่มลบแขก (X button)
    let xbtn = document.createElement('span')
    xbtn.addEventListener('click', removeGuest) // เพิ่ม event listener สำหรับการคลิกที่ปุ่ม X
    xbtn.innerHTML =
      `<span class="remove-icon" id=${guestItem.firstname}-${guestItem.lastname} 
    style="cursor:pointer;color:red">[X]</span>`

    //  เพิ่ม HTML element ของชื่อแขกและปุ่ม X เข้าไปใน div ของแขก
    guestdiv.appendChild(name)
    guestdiv.appendChild(xbtn)

    //  เพิ่ม div ของแขกลงใน display area
    displaylist.appendChild(guestdiv)
  }


  // 3. Function to display all existing guests in the display area
  function displayGuests(guestResult) {
    //  ดึง element ที่ต้องการแสดงผล (display area) จาก DOM
    let displaylist = document.querySelector('#display-area')

    //  ลบข้อมูลที่อาจมีอยู่ใน display area อยู่แล้ว (clear content)
    displaylist.textContent = ''

    //  วนลูปผ่าน guestResult เพื่อแสดงผลแขกแต่ละคน
    guestResult.forEach((guest) => {
      // ใช้ฟังก์ชัน displayGuest เพื่อแสดงผลแขกแต่ละคน
      displayGuest(guest);
    });
  }


  // 4. Function to search and display matching guests
  function searchGuest(event) {
    // ดึงค่าจาก input field ที่ใช้สำหรับการค้นหา
    let searchvalue = document.getElementById('search-input').value

    // Log ค่าคำค้นหาใน console (optional)
    console.log(searchvalue);

    // ดึงรายชื่อแขกทั้งหมดจาก guestList
    let realguest = guests.getAllGuests();

    // กรองรายชื่อแขกเฉพาะที่ตรงกับเงื่อนไขคำค้นหา
    let newguest = realguest.filter((guest) =>
      (guest.firstname.toLowerCase().includes(searchvalue.toLowerCase()) ||
        guest.firstname.toUpperCase().includes(searchvalue.toUpperCase()) ||
        guest.firstname.includes(searchvalue)) ||
      (guest.lastname.toLowerCase().includes(searchvalue.toLowerCase()) ||
        guest.lastname.toUpperCase().includes(searchvalue.toUpperCase()) ||
        guest.lastname.includes(searchvalue))
    );
    // เรียกใช้ฟังก์ชัน displayGuests เพื่อแสดงผลแขกที่ค้นหาได้ใน display area
    displayGuests(newguest);
  }

  // 5. Function to add a new guest
  function addGuest() {

    // ดึงข้อมูลจาก input fields
    const fnameInput = document.getElementById('firstname-input')
    const lnameInput = document.getElementById('lastname-input')

    // เรียกใช้เมธอด addNewGuest จาก guestList โดยส่งพารามิเตอร์มาจากข้อมูลที่ได้จาก input fields
    let newguest = guests.addNewGuest(fnameInput.value, lnameInput.value)

    // แสดงผลลัพธ์ล่าสุด (แขกที่เพิ่มล่าสุด) ในหน้าเว็บ
    displayGuest(newguest[newguest.length - 1])

  }

  // 6. Function to remove a guest
  function removeGuest(event) {
    // ดึง element ที่ใช้สำหรับแสดงผล (display area) จาก DOM
    let displayarea = document.getElementById('display-area')

    // ดึง id ของ element ที่ถูกคลิก
    let eventtarget = event.target.id.split('-')

    // สร้าง object ที่ต้องการลบ
    let deleteobject = { firstname: eventtarget[0], lastname: eventtarget[1] }

    // หา index ของแขกที่ต้องการลบในรายการทั้งหมด
    const deleteIndex = guests.getAllGuests().findIndex(
      (guest) =>
        deleteobject.firstname.toLowerCase() === guest.firstname.toLowerCase() &&
        deleteobject.lastname.toLowerCase() === guest.lastname.toLowerCase()
    )
    // ลบแขกจากรายการแขก
    guests.removeGuest(deleteobject)

    // ลบ element ที่มี index เท่ากับ deleteIndex ออกจาก display area
    displayarea.removeChild(displayarea.children[deleteIndex])

    // แสดงผลแขกทั้งหมดใหม่ใน display area
    displayGuests(guests.getAllGuests())

    // Log จำนวน element ที่เหลือใน display area และจำนวนแขกทั้งหมดใน guestList
    console.log(displayarea.children.length)
    console.log(guestList.getAllGuests().length)
  }


  return {
    registerEventHandling,
    displayGuests,
    searchGuest,
    addGuest,
    removeGuest
  }
}

// module.exports = guestForm
export { guestForm }
const { registerEventHandling, displayGuests } = guestForm()
registerEventHandling()
displayGuests(guestList.getAllGuests())
