<?php

namespace App\Http\Requests;

use App\Models\Organisation;
use Illuminate\Foundation\Http\FormRequest;

class OrganisationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        if (!$user) {
            return false;
        }

        $organisation = $user->organisation;

        if (!$organisation instanceof Organisation) {
            return false;
        }

        return isset($organisation->owner_id) && $user->id === $organisation->owner_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if ($this->isMethod('put') || $this->isMethod('patch') || $this->routeIs('organisations.update')) {
            return [
                'name' => ['required', 'string', 'max:255'],
            ];
        }

        if ($this->isMethod('post') || $this->routeIs('organisations.invite')) {
            return [
                'email' => ['required', 'email', 'max:255'],
            ];
        }

        return [
            //
        ];
    }
}
