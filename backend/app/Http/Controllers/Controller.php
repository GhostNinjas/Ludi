<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *     title="Ludi API",
 *     version="1.0.0",
 *     description="Educational app API for children aged 1-6 years",
 *     @OA\Contact(
 *         email="support@ludi.app"
 *     )
 * )
 * @OA\Server(
 *     url="http://localhost:8000",
 *     description="Local development server"
 * )
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
abstract class Controller
{
    //
}
