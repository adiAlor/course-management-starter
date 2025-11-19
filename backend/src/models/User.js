const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { username, email, password, full_name, role } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const [result] = await pool.execute(
        'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, full_name, role]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findByUsername(username) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE username = ? AND is_active = TRUE',
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, username, email, full_name, role, is_active, created_at, updated_at FROM users WHERE id = ? AND is_active = TRUE',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async update(id, userData) {
    const { username, email, full_name, role } = userData;
    try {
      const [result] = await pool.execute(
        'UPDATE users SET username = ?, email = ?, full_name = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [username, email, full_name, role, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'UPDATE users SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findAll(page = 1, limit = 10, role = null, search = '') {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE is_active = TRUE';
    let params = [];

    if (role) {
      whereClause += ' AND role = ?';
      params.push(role);
    }

    if (search) {
      whereClause += ' AND (username LIKE ? OR email LIKE ? OR full_name LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    try {
      const [rows] = await pool.execute(
        `SELECT id, username, email, full_name, role, created_at
         FROM users ${whereClause}
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      const [countRows] = await pool.execute(
        `SELECT COUNT(*) as total FROM users ${whereClause}`,
        params
      );

      return {
        users: rows,
        total: countRows[0].total,
        page,
        totalPages: Math.ceil(countRows[0].total / limit)
      };
    } catch (error) {
      throw error;
    }
  }

  static async getDashboardData(userId, userRole) {
    try {
      let dashboardData = {};

      switch (userRole) {
        case 'admin':
          const [userCounts] = await pool.execute('SELECT role, COUNT(*) as count FROM users WHERE is_active = TRUE GROUP BY role');
          const [courseCount] = await pool.execute('SELECT COUNT(*) as count FROM courses WHERE is_active = TRUE');
          const [classCount] = await pool.execute('SELECT COUNT(*) as count FROM classes WHERE is_active = TRUE');

          dashboardData = {
            userStats: userCounts,
            totalCourses: courseCount[0].count,
            totalClasses: classCount[0].count
          };
          break;

        case 'instructor':
          const [instructorCourses] = await pool.execute(
            `SELECT DISTINCT c.* FROM courses c
             JOIN class_courses cc ON c.id = cc.course_id
             WHERE cc.instructor_id = ? AND c.is_active = TRUE`,
            [userId]
          );
          const [instructorClasses] = await pool.execute(
            'SELECT * FROM classes WHERE instructor_id = ? AND is_active = TRUE',
            [userId]
          );

          dashboardData = {
            courses: instructorCourses,
            classes: instructorClasses
          };
          break;

        case 'student':
          const [studentClasses] = await pool.execute(
            `SELECT cl.*, co.name as cohort_name FROM classes cl
             JOIN student_classes sc ON cl.id = sc.class_id
             JOIN cohorts co ON cl.cohort_id = co.id
             WHERE sc.student_id = ? AND cl.is_active = TRUE`,
            [userId]
          );

          dashboardData = {
            enrolledClasses: studentClasses
          };
          break;

        case 'leadership':
          const [totalStudents] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = "student" AND is_active = TRUE');
          const [totalInstructors] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = "instructor" AND is_active = TRUE');
          const [totalCourses] = await pool.execute('SELECT COUNT(*) as count FROM courses WHERE is_active = TRUE');
          const [totalClasses] = await pool.execute('SELECT COUNT(*) as count FROM classes WHERE is_active = TRUE');

          dashboardData = {
            totalStudents: totalStudents[0].count,
            totalInstructors: totalInstructors[0].count,
            totalCourses: totalCourses[0].count,
            totalClasses: totalClasses[0].count
          };
          break;
      }

      return dashboardData;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;