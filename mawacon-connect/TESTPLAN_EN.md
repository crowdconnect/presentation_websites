# Test Plan: Mawacon Connect App

## Overview

This test plan describes the systematic testing of the app with **3 test customers** and validates the complete data flow:
- **Intranet** → **Public API (via Mirror)** → **Mobile App**
- **Admin Panel** → **Public API** → **Mobile App**

## Test Setup

### Create Test Customers

**Customer 1: Max Mustermann**
- Customer ID: `KD-11111111`
- Contract: Standard (500 MBit/s)
- TV Package: None
- Hardware: No orders
- Invoices: 3 invoices (all paid, PDFs can be any PDF files)

**Customer 2: Anna Schmidt**
- Customer ID: `KD-22222222`
- Contract: Premium (700 MBit/s)
- TV Package: Comfort waipu.tv
- Hardware: 1 router ordered
- Invoices: 5 invoices (all paid, PDFs can be any PDF files)

**Customer 3: Peter Müller**
- Customer ID: `KD-33333333`
- Contract: Basic (300 MBit/s)
- TV Package: Perfect Plus waipu.tv
- Hardware: WiFi Booster + TV Stick
- Invoices: 2 invoices (all paid, PDFs can be any PDF files)

**Note:** All invoices are paid. If payment is missing, further invoices will be created. The mobile app only displays PDF files for invoices - no database metadata (status, amounts, etc.) is shown in the app.

## Test Phase 1: Data Mirror (Intranet → Public API)

### Test 1.1: Initial Data Mirror
**Goal:** Verify that data from the intranet is correctly mirrored to the Public API.

**Steps:**
1. In the intranet, create data for all 3 customers:
   - Customer master data (name, customer ID, email)
   - Contract data (tariff, speed, price)
   - Invoice data (number, date, PDF file - any PDF file can be used, no need for real invoice PDFs)
   - TV package (if applicable)
   - Hardware orders (if applicable)

2. Call Mirror API (from intranet):
   ```
   POST /mirror/customer
   POST /mirror/contract
   POST /mirror/invoice
   POST /mirror/tv-package
   POST /mirror/hardware-order
   ```

3. **Expected Result:**
   - All data is stored in Public API DB
   - No errors in mirror logs
   - Data is retrievable via Public API

**Checklist:**
- [ ] Customer 1: All data mirrored
- [ ] Customer 2: All data mirrored
- [ ] Customer 3: All data mirrored
- [ ] Public API returns data correctly

### Test 1.2: Data Updates via Mirror
**Goal:** Verify that changes in the intranet are correctly updated.

**Steps:**
1. **Customer 1: Change contract**
   - In intranet: Change tariff from "Standard" to "Premium"
   - Call Mirror API with new contract data
   - Check in app: Contract should show "Premium"

2. **Customer 2: Add new invoice**
   - In intranet: Create new invoice (RE-2024-006, any PDF file)
   - Call Mirror API
   - Check in app: New invoice PDF should appear in list

3. **Customer 3: Cancel TV package**
   - In intranet: Set TV package to "null"
   - Call Mirror API
   - Check in app: Dashboard should show "No TV Package"

**Checklist:**
- [ ] Contract change is mirrored
- [ ] New invoice is mirrored
- [ ] TV package cancellation is mirrored
- [ ] App shows updated data (after mirror sync)

### Test 1.3: PDF Mirror for Invoices
**Goal:** Verify that invoice PDFs are correctly transferred.

**Steps:**
1. In intranet: Prepare PDF for invoice RE-2024-001 (Customer 1)
   - Note: Any PDF file can be used (no need for real invoice PDFs)
   - PDF can be a test document, sample PDF, etc.
2. Call Mirror API with PDF data
3. In app: Download invoice
4. Verify: PDF is complete and can be opened

**Checklist:**
- [ ] PDF is transferred via mirror
- [ ] PDF is stored in Public API
- [ ] Download link works in app
- [ ] PDF can be opened correctly
- [ ] Any PDF file format works (not limited to real invoice PDFs)

## Test Phase 2: Mobile App - Data Display

### Test 2.1: Login & Dashboard
**Goal:** Verify that customers can log in and see correct data.

**Steps:**
1. **Login Customer 1:**
   - Login with Customer ID + password
   - Check dashboard:
     - Name is displayed correctly
     - Contract: "Standard" with 500 MBit/s
     - TV Package: "No TV Package"
     - Action banner is displayed

2. **Login Customer 2:**
   - Check dashboard:
     - Contract: "Premium" with 700 MBit/s
     - TV Package: "Comfort waipu.tv"
     - Hardware: Router displayed

3. **Login Customer 3:**
   - Check dashboard:
     - Contract: "Basic" with 300 MBit/s
     - TV Package: "Perfect Plus waipu.tv"
     - Hardware: WiFi Booster + TV Stick

**Checklist:**
- [ ] Login works for all 3 customers
- [ ] Dashboard shows correct contract data
- [ ] Dashboard shows correct TV package data
- [ ] Dashboard shows correct hardware data
- [ ] Action banner is displayed

### Test 2.2: Display Invoices
**Goal:** Verify that invoice PDFs are displayed correctly.

**Steps:**
1. **Customer 1:**
   - Open invoices page
   - Verify: 3 invoice PDFs visible (only PDFs, no database metadata shown)
   - Test PDF download (one invoice)
   - Verify: PDF opens correctly

2. **Customer 2:**
   - Open invoices page
   - Verify: 5 invoice PDFs visible
   - Test PDF download
   - Verify: PDF opens correctly

3. **Customer 3:**
   - Open invoices page
   - Verify: 2 invoice PDFs visible
   - Test PDF download
   - Verify: PDF opens correctly

**Note:** The mobile app only displays PDF files. No invoice metadata (status, amounts, dates) from the database is shown in the app interface.

**Checklist:**
- [ ] All invoice PDFs are displayed
- [ ] PDFs can be downloaded
- [ ] PDFs open correctly
- [ ] Download links are time-limited (security)
- [ ] No database metadata is displayed (only PDFs)

### Test 2.3: Contract Management
**Goal:** Verify that contract data is displayed correctly.

**Steps:**
1. **Customer 1:**
   - Open contracts page
   - Verify: Current tariff "Standard" is displayed
   - Verify: Upgrade options are displayed (Premium, Gigabit)
   - Start upgrade process (see Test 3.1)

2. **Customer 2:**
   - Open contracts page
   - Verify: Current tariff "Premium" is displayed
   - Verify: Upgrade option "Gigabit" is displayed

3. **Customer 3:**
   - Open contracts page
   - Verify: Current tariff "Basic" is displayed
   - Verify: All upgrade options are displayed

**Checklist:**
- [ ] Current contract is displayed correctly
- [ ] Upgrade options are correctly filtered (only higher tariffs)
- [ ] Contract details (speed, price) are correct

### Test 2.4: Hardware & TV Packages
**Goal:** Verify that product catalog is displayed correctly.

**Steps:**
1. **Hardware page:**
   - All 3 customers: Open hardware page
   - Verify: All products are displayed (Router, WiFi Booster, TV Stick)
   - Verify: Prices are correct
   - Verify: Images are loaded

2. **TV Packages page:**
   - All 3 customers: Open TV packages page
   - Verify: Both packages are displayed (Comfort, Perfect Plus)
   - Verify: Already booked packages are marked
   - Customer 1: Verify that "No package booked" is displayed

**Checklist:**
- [ ] Hardware catalog is displayed correctly
- [ ] TV packages are displayed correctly
- [ ] Already booked packages are marked
- [ ] Product details are complete

### Test 2.5: Referral System
**Goal:** Verify that referral functions work correctly.

**Steps:**
1. **Customer 1:**
   - Open referral page
   - Verify: Personal code is displayed (based on Customer ID)
   - Verify: Gift is displayed (from Admin Panel)
   - Test sharing code (WhatsApp/Email)

2. **Customer 2 & 3:**
   - Perform same tests
   - Verify: Each customer has own code

**Checklist:**
- [ ] Referral code is generated correctly
- [ ] Code is unique per customer
- [ ] Gift is displayed from Admin Panel
- [ ] Share function works

## Test Phase 3: User Actions (App → Public API → Email)

### Test 3.1: Request Tariff Upgrade
**Goal:** Verify that upgrade requests are processed correctly.

**Steps:**
1. **Customer 1:**
   - Open contracts page
   - Select upgrade to "Premium"
   - Confirm
   - Verify: Confirmation message in app

2. **Check email:**
   - Email to employee should arrive (according to admin configuration)
   - Email should contain:
     - Customer name
     - Old tariff: "Standard"
     - New tariff: "Premium"
     - Customer ID

3. **Customer receives confirmation:**
   - Email to customer should arrive
   - Confirmation: "Your request has been received"

**Checklist:**
- [ ] Upgrade request is sent
- [ ] Email to employee arrives
- [ ] Email to customer arrives
- [ ] Email contents are correct

### Test 3.2: Order Hardware
**Goal:** Verify that hardware orders are processed correctly.

**Steps:**
1. **Customer 1:**
   - Open hardware page
   - Select router
   - Click "Add to cart"
   - Order
   - Verify: Confirmation message

2. **Check email:**
   - Email to employee should arrive
   - Email should contain:
     - Customer name
     - Product: "Mawacon Premium Router"
     - Price: "149.99 €"
     - Customer ID
     - Delivery address (from customer master data)

3. **Customer receives confirmation:**
   - Email to customer should arrive

**Checklist:**
- [ ] Order is sent
- [ ] Email to employee arrives
- [ ] Email to customer arrives
- [ ] Order history is updated (after mirror sync)

### Test 3.3: Book TV Package
**Goal:** Verify that TV package bookings are processed correctly.

**Steps:**
1. **Customer 1:**
   - Open TV packages page
   - Select "Comfort waipu.tv"
   - Click "Book now"
   - Confirm

2. **Check email:**
   - Email to employee should arrive
   - Email should contain:
     - Customer name
     - Package: "Comfort waipu.tv"
     - Price: "6.99 €/month"
     - Customer ID

3. **Customer receives confirmation:**
   - Email to customer should arrive

**Checklist:**
- [ ] Booking is sent
- [ ] Email to employee arrives
- [ ] Email to customer arrives
- [ ] Already booked packages are marked (after mirror sync)

## Test Phase 4: Admin Panel

### Test 4.1: Configure Email Routing
**Goal:** Verify that email routing works correctly.

**Steps:**
1. Open Admin Panel
2. Change email routing:
   - Hardware orders: `hardware-test@mawacon.de`
   - TV bookings: `tv-test@mawacon.de`
   - Contract upgrades: `upgrade-test@mawacon.de`
3. Save

4. **Perform test:**
   - Customer 1: Order hardware
   - Verify: Email goes to `hardware-test@mawacon.de`
   - Customer 2: Book TV package
   - Verify: Email goes to `tv-test@mawacon.de`
   - Customer 3: Upgrade tariff
   - Verify: Email goes to `upgrade-test@mawacon.de`

**Checklist:**
- [ ] Email routing can be changed
- [ ] Changes are saved
- [ ] Emails go to correct addresses
- [ ] Changes take effect immediately (no restart needed)

### Test 4.2: Configure Referral Gift
**Goal:** Verify that gift management works.

**Steps:**
1. Open Admin Panel
2. Change referral gift:
   - Name: "Mawacon Wish Gift"
   - Description: "Collect recommendations and choose your favorite gift"
   - Upload image (new image)
3. Save

4. **Check in app:**
   - All 3 customers: Open referral page
   - Verify: New gift is displayed
   - Verify: Name, description, image are correct

5. **Change gift again:**
   - Name: "50€ Amazon Voucher"
   - Description: "Receive a 50€ voucher"
   - Upload new image
   - Save

6. **Check in app:**
   - Gift should be updated

**Checklist:**
- [ ] Gift can be changed
   - [ ] Name
   - [ ] Description
   - [ ] Image
- [ ] Changes are saved
- [ ] App displays updated gift
- [ ] Image upload works

### Test 4.3: Configure Action Banner
**Goal:** Verify that banner management works.

**Steps:**
1. Open Admin Panel
2. Change banner:
   - Title: "Summer Campaign 2024"
   - Text: "Get 3 months free now!"
   - Upload new image
   - Activate banner
3. Save

4. **Check in app:**
   - All 3 customers: Open dashboard
   - Verify: New banner is displayed
   - Verify: Title and text are correct

5. **Deactivate banner:**
   - Set switch to "Off"
   - Save

6. **Check in app:**
   - Banner should no longer be displayed

**Checklist:**
- [ ] Banner can be changed
   - [ ] Title
   - [ ] Text
   - [ ] Image
- [ ] Banner can be activated/deactivated
- [ ] Changes are immediately visible in app
- [ ] Deactivated banner is not displayed

### Test 4.4: Configure Support Data
**Goal:** Verify that support contact data works correctly.

**Steps:**
1. Open Admin Panel
2. Change support data:
   - WhatsApp: `https://wa.me/49987654321`
   - Email: `support-new@mawacon.de`
   - Phone: `+49 800 999 888`
3. Save

4. **Check in app:**
   - All 3 customers: Open support page
   - Verify: WhatsApp link is correct
   - Verify: Email address is correct
   - Verify: Phone number is correct
   - Test WhatsApp link (opens WhatsApp)

**Checklist:**
- [ ] Support data can be changed
- [ ] Changes are displayed in app
- [ ] WhatsApp link works
- [ ] Email link works
- [ ] Phone link works

## Test Phase 5: Data Synchronization

### Test 5.1: Mirror Sync After Changes
**Goal:** Verify that data changes are correctly synchronized.

**Steps:**
1. **Change in intranet:**
   - Customer 1: Add new invoice (any PDF file)
   - Customer 2: Cancel TV package
   - Customer 3: Add hardware order

2. **Call Mirror API:**
   - Send all changes via Mirror API

3. **Check in app (after sync):**
   - Customer 1: New invoice PDF should appear in list
   - Customer 2: TV package should show "No Package"
   - Customer 3: New hardware should appear in history

**Checklist:**
- [ ] Invoice PDF changes are synchronized
- [ ] TV package changes are synchronized
- [ ] Hardware changes are synchronized
- [ ] App shows updated data (PDFs for invoices)

### Test 5.2: Multiple Updates
**Goal:** Verify that repeated updates work correctly.

**Steps:**
1. **Customer 1: Multiple changes**
   - In intranet: Change contract → Mirror
   - In intranet: Add invoice (PDF) → Mirror
   - In intranet: Add another invoice (PDF) → Mirror

2. **Check in app:**
   - All changes should be displayed correctly
   - New invoice PDFs should appear
   - No data loss
   - No duplicate entries

**Checklist:**
- [ ] Multiple updates work
- [ ] New invoice PDFs are added correctly
- [ ] No data loss
- [ ] No duplicate entries
- [ ] Data is consistent

## Test Phase 6: Error Handling & Edge Cases

### Test 6.1: Missing Data
**Goal:** Verify how app handles missing data.

**Steps:**
1. **Customer without invoices:**
   - Create new test customer (without invoices)
   - Login in app
   - Open invoices page
   - Verify: "No invoices" or empty state is displayed
   - Verify: No errors or crashes occur

2. **Customer without TV package:**
   - Customer 1: Remove TV package (via mirror)
   - Check in app: "No TV Package" is displayed

**Checklist:**
- [ ] App shows meaningful messages for missing data
- [ ] No errors or crashes
- [ ] UI remains user-friendly

### Test 6.2: Invalid Data
**Goal:** Verify how system handles invalid data.

**Steps:**
1. **Send invalid mirror data:**
   - Customer ID missing
   - Price is negative
   - Date is invalid

2. **Verify:**
   - Mirror API should return error
   - No invalid data is stored
   - Logs show error

**Checklist:**
- [ ] Invalid data is rejected
- [ ] Error messages are understandable
- [ ] System remains stable

### Test 6.3: PDF Download Security
**Goal:** Verify that PDF downloads are secure and customers cannot access other customers' invoices.

**Steps:**
1. **Customer 1:**
   - Download own invoice
   - Copy download link (direct link or pre-signed URL)
   - Wait 2 hours (or test time limit)
   - Call link again
   - Verify: Link should be expired, no access possible

2. **Cross-customer access test:**
   - Customer 1: Get download link for own invoice
   - Try to access Customer 2's invoice using:
     - Direct link manipulation (if invoice ID is in URL)
     - Pre-signed URL from Customer 1's session
     - Try to request pre-signed URL for Customer 2's invoice ID
   - Verify: All attempts should fail
   - Verify: API returns 403 Forbidden or 404 Not Found

3. **Verify security:**
   - Download links should be customer-specific
   - Pre-signed URLs should include customer authentication
   - Direct links should validate customer ownership

**Checklist:**
- [ ] Download links are time-limited
- [ ] Expired links don't work
- [ ] Customers cannot access other customers' invoices via direct link
- [ ] Customers cannot access other customers' invoices via pre-signed URL
- [ ] API rejects unauthorized invoice access attempts
- [ ] Security errors are handled gracefully (no sensitive data leaked)

## Test Phase 7: Performance & Stability

### Test 7.1: Multiple Customers Simultaneously
**Goal:** Verify that system handles multiple concurrent requests.

**Steps:**
1. All 3 customers simultaneously:
   - Perform login
   - Open dashboard
   - Load invoices
   - Open hardware page

2. **Verify:**
   - All requests are answered correctly
   - No timeouts
   - No errors

**Checklist:**
- [ ] System handles multiple concurrent requests
- [ ] Response times are acceptable
- [ ] No errors

### Test 7.2: Large Data Volumes
**Goal:** Verify that system handles large amounts of data.

**Steps:**
1. **Customer 1:**
   - Add 50 invoice PDFs via mirror (any PDF files can be used)
   - In app: Open invoices page
   - Verify: All invoice PDFs are displayed
   - Verify: Performance is acceptable
   - Verify: PDFs can be downloaded

**Checklist:**
- [ ] Many invoice PDFs are displayed correctly
- [ ] Performance remains acceptable
- [ ] Pagination works (if implemented)
- [ ] All PDFs are accessible

---

## Test Summary

### Success Criteria
- [ ] All 3 test customers can log in
- [ ] All data is correctly mirrored from intranet
- [ ] App displays all data correctly
- [ ] All user actions (upgrade, order, booking) work
- [ ] Emails are sent correctly
- [ ] Admin panel changes take effect immediately
- [ ] PDF downloads work securely
- [ ] System is stable under load

### Known Limitations (according to development plan)
- Mirror does not run in real-time (e.g., once per hour)
- No automatic referral code validation
- No automatic provisioning (everything via email)



