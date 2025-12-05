<?php

namespace App\Http\Requests\Vote;

use App\Models\Vote;
use Illuminate\Foundation\Http\FormRequest;

class StoreVoteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'minecraft_username' => [
                'required',
                'string',
                'min:3',
                'max:16',
                'regex:/^[a-zA-Z0-9_]+$/',
            ],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(\Illuminate\Validation\Validator $validator): void
    {
        $validator->after(function (\Illuminate\Validation\Validator $validator) {
            if ($this->hasCooldown()) {
                $validator->errors()->add(
                    'cooldown',
                    'You have already voted for this server in the last 24 hours.'
                );
            }
        });
    }

    /**
     * Check if user has voted for this server in the last 24 hours.
     * Admins bypass this cooldown.
     */
    protected function hasCooldown(): bool
    {
        $user = $this->user();

        // Admins bypass cooldown
        if ($user->isAdmin()) {
            return false;
        }

        $server = $this->route('server');

        return Vote::where('server_id', $server->id)
            ->where('user_id', $user->id)
            ->where('created_at', '>=', now()->subHours(24))
            ->exists();
    }

    /**
     * Get custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'minecraft_username.regex' => 'Minecraft username can only contain letters, numbers, and underscores.',
        ];
    }
}
