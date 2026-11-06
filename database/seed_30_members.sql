-- ============================================================
-- Seed 30 Realistic Indian Members for REFORM PHASE (gymapp)
-- Does NOT delete or alter existing data.
-- ============================================================

START TRANSACTION;

-- ------------------------------------------------------------
-- Member 1: Aarav Sharma (Annual, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Aarav Sharma', '9820123456', 'aarav.sharma@gmail.com', 'Annual', '2026-01-10');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 7999.00, DATE_ADD('2026-01-10', INTERVAL 365 DAY), '2026-01-10', 'paid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'absent');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'present');

-- ------------------------------------------------------------
-- Member 2: Diya Nair (Monthly, Unpaid - Overdue)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Diya Nair', '9845112233', 'diya.nair@outlook.com', 'Monthly', '2026-02-01');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 999.00, DATE_SUB(CURDATE(), INTERVAL 4 DAY), NULL, 'unpaid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'present');

-- ------------------------------------------------------------
-- Member 3: Rohan Gupta (Quarterly, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Rohan Gupta', '9811223344', 'rohan.gupta@yahoo.com', 'Quarterly', '2026-01-20');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 2499.00, DATE_ADD('2026-01-20', INTERVAL 90 DAY), '2026-01-20', 'paid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'absent');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'present');

-- ------------------------------------------------------------
-- Member 4: Ananya Iyer (Annual, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Ananya Iyer', '9890334455', 'ananya.iyer@gmail.com', 'Annual', '2026-01-05');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 7999.00, DATE_ADD('2026-01-05', INTERVAL 365 DAY), '2026-01-05', 'paid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'present');

-- ------------------------------------------------------------
-- Member 5: Vikram Malhotra (Monthly, Unpaid - Due Tomorrow)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Vikram Malhotra', '9717445566', 'vikram.m@gmail.com', 'Monthly', '2026-02-15');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 999.00, DATE_ADD(CURDATE(), INTERVAL 1 DAY), NULL, 'unpaid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'absent');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present');

-- ------------------------------------------------------------
-- Member 6: Meera Krishnan (Quarterly, Unpaid - Due Today)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Meera Krishnan', '9840556677', 'meera.krishnan@gmail.com', 'Quarterly', '2026-01-15');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 2499.00, CURDATE(), NULL, 'unpaid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'present');

-- ------------------------------------------------------------
-- Member 7: Siddharth Rao (Annual, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Siddharth Rao', '9880667788', 'siddharth.rao@gmail.com', 'Annual', '2026-02-10');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 7999.00, DATE_ADD('2026-02-10', INTERVAL 365 DAY), '2026-02-10', 'paid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'present');

-- ------------------------------------------------------------
-- Member 8: Kavya Nambiar (Monthly, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Kavya Nambiar', '9745778899', 'kavya.nambiar@gmail.com', 'Monthly', '2026-02-18');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 999.00, DATE_ADD('2026-02-18', INTERVAL 30 DAY), '2026-02-18', 'paid');

-- Not marked today
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'present');

-- ------------------------------------------------------------
-- Member 9: Aditya Joshi (Quarterly, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Aditya Joshi', '9822889900', 'aditya.joshi@gmail.com', 'Quarterly', '2026-01-25');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 2499.00, DATE_ADD('2026-01-25', INTERVAL 90 DAY), '2026-01-25', 'paid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present');

-- ------------------------------------------------------------
-- Member 10: Pooja Deshmukh (Monthly, Unpaid - Overdue)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Pooja Deshmukh', '9890990011', 'pooja.deshmukh@gmail.com', 'Monthly', '2026-01-28');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 999.00, DATE_SUB(CURDATE(), INTERVAL 8 DAY), NULL, 'unpaid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'absent');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'present');

-- ------------------------------------------------------------
-- Member 11: Ishaan Chatterjee (Annual, Unpaid - Due in 2 Days)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Ishaan Chatterjee', '9830112233', 'ishaan.c@gmail.com', 'Annual', '2026-02-05');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 7999.00, DATE_ADD(CURDATE(), INTERVAL 2 DAY), NULL, 'unpaid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'present');

-- ------------------------------------------------------------
-- Member 12: Ritu Bhattacharya (Monthly, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Ritu Bhattacharya', '9831223344', 'ritu.b@gmail.com', 'Monthly', '2026-02-12');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 999.00, DATE_ADD('2026-02-12', INTERVAL 30 DAY), '2026-02-12', 'paid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');

-- ------------------------------------------------------------
-- Member 13: Varun Kapoor (Quarterly, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Varun Kapoor', '9810334455', 'varun.kapoor@gmail.com', 'Quarterly', '2026-01-18');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 2499.00, DATE_ADD('2026-01-18', INTERVAL 90 DAY), '2026-01-18', 'paid');

-- Not marked today
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present');

-- ------------------------------------------------------------
-- Member 14: Neha Singhal (Monthly, Unpaid - Due in 3 Days)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Neha Singhal', '9818445566', 'neha.singhal@gmail.com', 'Monthly', '2026-02-20');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 999.00, DATE_ADD(CURDATE(), INTERVAL 3 DAY), NULL, 'unpaid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present');

-- ------------------------------------------------------------
-- Member 15: Kabir Mehta (Annual, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Kabir Mehta', '9821556677', 'kabir.mehta@gmail.com', 'Annual', '2026-01-08');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 7999.00, DATE_ADD('2026-01-08', INTERVAL 365 DAY), '2026-01-08', 'paid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'present');

-- ------------------------------------------------------------
-- Member 16: Tanvi Kulkarni (Quarterly, Unpaid - Overdue)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Tanvi Kulkarni', '9823667788', 'tanvi.kulkarni@gmail.com', 'Quarterly', '2026-01-12');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 2499.00, DATE_SUB(CURDATE(), INTERVAL 3 DAY), NULL, 'unpaid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'absent');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'absent');

-- ------------------------------------------------------------
-- Member 17: Aman Choudhury (Monthly, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Aman Choudhury', '9435778899', 'aman.choudhury@gmail.com', 'Monthly', '2026-02-14');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 999.00, DATE_ADD('2026-02-14', INTERVAL 30 DAY), '2026-02-14', 'paid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present');

-- ------------------------------------------------------------
-- Member 18: Shreya Pillai (Annual, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Shreya Pillai', '9847889900', 'shreya.pillai@gmail.com', 'Annual', '2026-01-22');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 7999.00, DATE_ADD('2026-01-22', INTERVAL 365 DAY), '2026-01-22', 'paid');

-- Not marked today
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'present');

-- ------------------------------------------------------------
-- Member 19: Kunal Aggarwal (Monthly, Unpaid - Due Later in 14 Days)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Kunal Aggarwal', '9811990011', 'kunal.aggarwal@gmail.com', 'Monthly', '2026-02-24');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 999.00, DATE_ADD(CURDATE(), INTERVAL 14 DAY), NULL, 'unpaid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present');

-- ------------------------------------------------------------
-- Member 20: Roshni Sen (Quarterly, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Roshni Sen', '9836112233', 'roshni.sen@gmail.com', 'Quarterly', '2026-01-30');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 2499.00, DATE_ADD('2026-01-30', INTERVAL 90 DAY), '2026-01-30', 'paid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'present');

-- ------------------------------------------------------------
-- Member 21: Nikhil Varma (Monthly, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Nikhil Varma', '9849223344', 'nikhil.varma@gmail.com', 'Monthly', '2026-02-08');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 999.00, DATE_ADD('2026-02-08', INTERVAL 30 DAY), '2026-02-08', 'paid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');

-- ------------------------------------------------------------
-- Member 22: Anika Reddy (Annual, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Anika Reddy', '9848334455', 'anika.reddy@gmail.com', 'Annual', '2026-01-14');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 7999.00, DATE_ADD('2026-01-14', INTERVAL 365 DAY), '2026-01-14', 'paid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'present');

-- ------------------------------------------------------------
-- Member 23: Devansh Pandey (Quarterly, Unpaid - Due Later in 20 Days)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Devansh Pandey', '9415445566', 'devansh.pandey@gmail.com', 'Quarterly', '2026-02-02');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 2499.00, DATE_ADD(CURDATE(), INTERVAL 20 DAY), NULL, 'unpaid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'absent');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'absent');

-- ------------------------------------------------------------
-- Member 24: Swati Saxena (Monthly, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Swati Saxena', '9826556677', 'swati.saxena@gmail.com', 'Monthly', '2026-02-16');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 999.00, DATE_ADD('2026-02-16', INTERVAL 30 DAY), '2026-02-16', 'paid');

-- Not marked today
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present');

-- ------------------------------------------------------------
-- Member 25: Harish Menon (Annual, Unpaid - Due Later in 25 Days)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Harish Menon', '9846667788', 'harish.menon@gmail.com', 'Annual', '2026-02-11');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 7999.00, DATE_ADD(CURDATE(), INTERVAL 25 DAY), NULL, 'unpaid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present');

-- ------------------------------------------------------------
-- Member 26: Preeti Jain (Monthly, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Preeti Jain', '9829778899', 'preeti.jain@gmail.com', 'Monthly', '2026-02-04');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 999.00, DATE_ADD('2026-02-04', INTERVAL 30 DAY), '2026-02-04', 'paid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'present');

-- ------------------------------------------------------------
-- Member 27: Gautham Hegde (Quarterly, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Gautham Hegde', '9886889900', 'gautham.hegde@gmail.com', 'Quarterly', '2026-01-16');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 2499.00, DATE_ADD('2026-01-16', INTERVAL 90 DAY), '2026-01-16', 'paid');

-- Not marked today
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'present');

-- ------------------------------------------------------------
-- Member 28: Shalini Rajan (Monthly, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Shalini Rajan', '9841990011', 'shalini.rajan@gmail.com', 'Monthly', '2026-02-22');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 999.00, DATE_ADD('2026-02-22', INTERVAL 30 DAY), '2026-02-22', 'paid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'present');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present');

-- ------------------------------------------------------------
-- Member 29: Tarun Oberoi (Annual, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Tarun Oberoi', '9811001122', 'tarun.oberoi@gmail.com', 'Annual', '2026-01-11');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 7999.00, DATE_ADD('2026-01-11', INTERVAL 365 DAY), '2026-01-11', 'paid');

INSERT INTO attendance (member_id, date, status) VALUES (@m_id, CURDATE(), 'absent');
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'present');

-- ------------------------------------------------------------
-- Member 30: Divya Sundaram (Monthly, Paid)
-- ------------------------------------------------------------
INSERT INTO members (name, phone, email, plan_type, join_date)
VALUES ('Divya Sundaram', '9840112244', 'divya.sundaram@gmail.com', 'Monthly', '2026-02-25');
SET @m_id = LAST_INSERT_ID();

INSERT INTO fees (member_id, amount, due_date, paid_date, status)
VALUES (@m_id, 999.00, DATE_ADD('2026-02-25', INTERVAL 30 DAY), '2026-02-25', 'paid');

-- Not marked today
INSERT INTO attendance (member_id, date, status) VALUES (@m_id, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'present');

COMMIT;

