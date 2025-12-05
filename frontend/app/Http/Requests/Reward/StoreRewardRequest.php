<?php

namespace App\Http\Requests\Reward;

use App\Enums\RewardType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRewardRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $server = $this->route('server');

        return $this->user()->id === $server->user_id || $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
            'reward_type' => ['required', Rule::enum(RewardType::class)],
            'commands' => ['required', 'array', 'min:1'],
            'commands.*' => ['required', 'string', 'max:500'],
            'chance' => ['required', 'integer', 'min:1', 'max:100'],
            'is_active' => ['boolean'],
            'min_votes' => ['nullable', 'integer', 'min:0'],
            'daily_limit' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'commands.required' => 'At least one command is required.',
            'commands.min' => 'At least one command is required.',
            'commands.*.required' => 'Command cannot be empty.',
            'chance.min' => 'Chance must be at least 1%.',
            'chance.max' => 'Chance cannot exceed 100%.',
        ];
    }
}
