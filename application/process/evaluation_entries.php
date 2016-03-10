<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Evaluation_entries
{
	function get_persons_to_evaluate($con, $userid)
	{
		// select all users who can be evaluated and other parameters 
		$sql = "SELECT to_evaluate, users.uname, evtype, users.supervisor, results.open, tc, ea, ap, student, year, semester
				FROM results
				INNER JOIN users ON users.hashid =results.to_evaluate
				WHERE evaluator='$userid';";
		$query = mysqli_query($con, $sql);
		$numrows = mysqli_num_rows($query);
		if ($numrows == 0)
		{
			return NULL;
		}
		$persons = array();
		$a = 0;
		
		while ($row = mysqli_fetch_array($query))
		{
			// check if evaluation was accomplished
			$answered = 'no';
			if ($row[2] != 'student-teacher' AND ($row[5] != NULL OR  $row[6] != NULL OR $row[7] != NULL))
			{
				$answered = 'yes';
			}
			
			// for students
			if ($row[2] == 'student-teacher' AND $row[8] != NULL)
			{
				$answered = 'yes';
			}
			
			$persons[$a] = array(
				'userid' => $row[0],
				'full_name' => ucwords($row[1]),
				'type' => $row[2],
				'position' => $row[3],
				'open' => $row[4],
				'year' => substr($row[9], 0, strlen($row[9]) / 2).'-'.substr($row[9], strlen($row[9]) / 2),
				'semester' => $row[10],
				'is_answered' => $answered
			);
			$a++;
		}
		
		return $persons;
	}
	
	function get_rating_for_person($con, $userid, $utype, $id, $year, $semester)
	{
		switch ($utype)
		{
			case 'student':
				$sql = "SELECT users.uname, student
						FROM results
						INNER JOIN users ON users.hashid =results.to_evaluate
						WHERE year=? AND evaluator=? AND to_evaluate=?";
				$stmt = mysqli_prepare($con, $sql);
				
				mysqli_stmt_bind_param($stmt, 'iss', $year, $userid, $id);	
					
				mysqli_stmt_execute($stmt);
				$query = mysqli_stmt_get_result($stmt);
				
				$row = mysqli_fetch_array($query);
				
				$rating['target'] = array(
					'name' => $row[0],
					'score' => 'Score : '.$row[1]
				);
				
				return $rating;
			
			case 'faculty':
				$sql = "SELECT users.uname, tc, ea, ap
						FROM results
						INNER JOIN users ON users.hashid =results.to_evaluate
						WHERE year=? AND semester=? AND evaluator=? AND to_evaluate=?";
						
				$stmt = mysqli_prepare($con, $sql);
				
				mysqli_stmt_bind_param($stmt, 'iiss', $year, $semester, $userid, $id);	
				
				mysqli_stmt_execute($stmt);
				$query = mysqli_stmt_get_result($stmt);
				
				$row = mysqli_fetch_array($query);
				
				if ($userid == $id)
					$name = 'Self Evaluation:';
				else $name = ucwords($row[0]);
				$rating['target'] = array(
					'name' => $name,
					'tc' => 'Teaching Competencies: '.$row[1],
					'ea' => 'Efficiency and Attitude: '.$row[2],
					'ap' => 'Attendance and Punctuality: '.$row[3]
				);
				
				return $rating;
			default:
				exit ('Invalid session');
		}
	}
	
}

/* End of file */
