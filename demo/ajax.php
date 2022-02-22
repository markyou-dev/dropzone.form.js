<?php
if (isset($_REQUEST['act']) && $_REQUEST['act']) {
    switch ($_REQUEST['act']) {
        case 'submit' : // submit action
            $data = array(
                'params' => $_REQUEST,
                'files'  => $_FILES,
            );
            break;
        case 'getList' : // get list
            $dummy = new Dummy();
            $data = $dummy->getList($_REQUEST['name']);
            break;
    }
    $json = json_encode($data);
    print_r($json);
}

// dummy data class
class Dummy
{
    function getList($name)
    {
        // dummy data
        $list = array(
            'slide1' => array(
                array(
                    'id'  => 1,
                    'src' => './img/m1.png'
                ),
                array(
                    'id'  => 2,
                    'src' => './img/m2.png'
                ),
                array(
                    'id'  => 3,
                    'src' => './img/m3.png'
                ),
            ),
            'slide2' => array(
                array(
                    'id'  => 4,
                    'src' => './img/w1.png'
                ),
                array(
                    'id'  => 5,
                    'src' => './img/w2.png'
                ),
                array(
                    'id'  => 6,
                    'src' => './img/w3.png'
                ),
            )
        );
        return $list[$name];
    }
}

exit;