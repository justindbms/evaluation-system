<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class File_upload_parser
{
	var $upload_path = '';
	var $folder = '';
	
	function image_upload()
	{
		// initialize upload path
		$this->folder = 'images';
		$this->upload_path = $folder;
		
		if (realpath($this->upload_path) !== FALSE)
		{
			$this->upload_path = realpath($this->upload_path).'/';
		}
		
		$this->upload_path = rtrim($this->upload_path, '/').'/';
		$this->folder = rtrim($this->folder, '/').'/';
		
		// move file from temporary location to desired path
		if (move_uploaded_file($_FILES['facultyPhoto']['tmp_name'], $this->upload_path.basename($_FILES['facultyPhoto']['name']))) 
		{
			return TRUE;
		}
		else return FALSE;
	}
	
	function store_image_reference($con)
	{
		$sql = "SELECT id
				FROM img_uploads 
				WHERE userId=?";
		$stmt = mysqli_prepare($con, $sql);
		mysqli_stmt_bind_param($stmt, 'ss', $userkey, $img_reference);
		
		$userkey = mysqli_real_escape_string($con, $_POST['userPhotoId']);
		
		mysqli_stmt_execute($stmt);
		$query = mysqli_stmt_get_result($stmt);
		
		$query = mysqli_query($con, $sql);
		$numrows = mysqli_num_rows($query);
		
		// update if already exists or create new entry otherwise
		if ($numrows > 0)
		{
			$sql = "UPDATE img_uploads 
					SET userId=?, img_reference=?";
		}
		else
		{
			$sql = "INSERT INTO img_uploads 
					(userId, img_reference) VALUES (?, ?)";
		}
		$stmt = mysqli_prepare($con, $sql);
		mysqli_stmt_bind_param($stmt, 'ss', $userkey, $img_reference);
		
		$img_reference = $this->folder.basename($_FILES['facultyPhoto']['name']);
		
		mysqli_stmt_execute($stmt);
	}
	
	function get_image_reference($con, $id, $no_photo_ref)
	{
		$sql = "SELECT img_reference
				FROM img_uploads
				WHERE userId=?";
		$stmt = mysqli_prepare($con, $sql);
		mysqli_stmt_bind_param($stmt, 's', $id);
		
		mysqli_stmt_execute($stmt);
		$query = mysqli_stmt_get_result($stmt);
		$row = mysqli_fetch_array($query);
		$numrows = mysqli_num_rows($query);
		if ($numrows == 0)
		{
			return $no_photo_ref;
		}
		else return base_url.$row[0];
	}
	
	function csv_upload()
	{
		// initialize upload path
		$this->upload_path = 'files';
		
		if (realpath($this->upload_path) !== FALSE)
		{
			$this->upload_path = realpath($this->upload_path).'/';
		}
		
		$this->upload_path = rtrim($this->upload_path, '/').'/';
		
		// move file from temporary location to desired path
		if (move_uploaded_file($_FILES['questionFile']['tmp_name'], $this->upload_path.basename($_FILES['questionFile']['name']))) 
		{
			return TRUE;
		}
		else return FALSE;
	}
	
	// return the filepath and the name of the table to be edited
	function csv_get_reference_path($con)
	{
		$name = mysqli_real_escape_string($con, $_POST['questionnaire']);
		$csv_path = $this->upload_path.basename($_FILES['questionFile']['name']);
		
		// hack
		switch($name)
		{
			case 'student_questionnaire':
			case 'teaching_competencies':
			case 'efficiency_and_attitude':
			case 'attendance_and_punctuality':
				break;
			default:
				exit ('Invalid Key');
		}
		
		$data = array(
			'name' => $name,
			'path' => $csv_path
		);
		return $data;
	}
}

/* End of file */
