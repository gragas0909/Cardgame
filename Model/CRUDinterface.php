<?php
interface CRUDInterface {
    public function create($data);
    public function read($id);
    public function update($id, $data);
    public function delete($id);
}
?>
