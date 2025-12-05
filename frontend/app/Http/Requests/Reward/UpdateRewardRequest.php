<?php

namespace App\Http\Requests\Reward;

use App\Enums\RewardType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRewardRequest extends FormRequest
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
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
            'reward_type' => ['sometimes', 'required', Rule::enum(RewardType::class)],
            'commands' => ['sometimes', 'required', 'array', 'min:1'],
            'commands.*' => ['required', 'string', 'max:500'],
            'chance' => ['sometimes', 'required', 'integer', 'min:1', 'max:100'],
            'is_active' => ['boolean'],
            'min_votes' => ['nullable', 'integer', 'min:0'],
            'daily_limit' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
